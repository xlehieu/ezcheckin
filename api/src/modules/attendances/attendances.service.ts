import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Model, QueryFilter, Types } from 'mongoose';
import { Business, BusinessDocument } from '../business/schema/business.entity';
import { Shift, ShiftDocument } from '../shifts/schema/shift.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import {
  Attendance,
  AttendanceCheckoutStatus,
  AttendanceDocument,
} from './schema/attendance.schema';
import { CheckinStatus } from '@/@types/attendance.type';
import { UserLogin } from '@/modules/auth/dto/auth.dto';
import { GetAttendanceFilterDto } from './dto/attendance-filter.dto';
import { UserDocument } from '../users/schema/users.schema';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Injectable()
export class AttendancesService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Shift.name) private shiftModel: Model<ShiftDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}
  async findAllByBusiness(businessId: string, filters: GetAttendanceFilterDto) {
    const { shiftId, userId, fromDate, toDate } = filters;
    const query: QueryFilter<Attendance> = { business: new Types.ObjectId(businessId) };
    if (shiftId) {
      query.shift = new Types.ObjectId(shiftId);
    }
    if (userId) {
      query.user = new Types.ObjectId(userId);
    }
    if (fromDate || toDate) {
      query.workDate = {};
      if (fromDate) {
        query.workDate.$gte = dayjs(fromDate).startOf('day').toDate();
      }
      if (toDate) {
        query.workDate.$lte = dayjs(toDate).endOf('day').toDate();
      }
    }
    const data = await this.attendanceModel
      .find(query)
      .populate<{user:UserDocument}>('user', 'fullName employeeCode email') // Chỉ lấy các field cần thiết của User
      .populate<{user:ShiftDocument}>('shift', 'name startTime endTime') // Lấy thông tin ca
      .sort({ workDate: -1, checkinTime: -1 }) // Mới nhất lên đầu
      .lean();

    return data;
  }

  /**
   * Thống kê nhanh số lượng đi muộn/về sớm của công ty
   */
  async getStats(businessId: string, date?: string) {
    const targetDate = date
      ? dayjs(date).startOf('day').toDate()
      : dayjs().startOf('day').toDate();

    const stats = await this.attendanceModel.aggregate([
      {
        $match: {
          business: new Types.ObjectId(businessId),
          workDate: targetDate,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          lateCheckin: {
            $sum: { $cond: [{ $eq: ['$statusCheckin', 'LATE'] }, 1, 0] },
          },
          earlyCheckout: {
            $sum: { $cond: [{ $eq: ['$statusCheckout', 'EARLY'] }, 1, 0] },
          },
          present: {
            $sum: { $cond: [{ $ne: ['$checkinTime', null] }, 1, 0] },
          },
        },
      },
    ]);

    return (
      stats[0] || { total: 0, lateCheckin: 0, earlyCheckout: 0, present: 0 }
    );
  }

  async checkinCheckout(dto: CreateAttendanceDto, userLogin: UserLogin) {
    const { sub: userId, businessId } = userLogin;
    const now = dayjs();

    // 1. Tìm bản ghi chưa checkout gần nhất
    const previousAttendance = await this.attendanceModel
      .findOne({
        user: new Types.ObjectId(userId),
        business: new Types.ObjectId(businessId),
        shift: new Types.ObjectId(dto.shiftId),
        checkoutTime: null,
      })
      .sort({ checkinTime: -1 });

    const [currentShift, myBusiness] = await Promise.all([
      this.shiftModel.findById(dto.shiftId).lean(),
      this.businessModel.findById(businessId).lean(),
    ]);

    if (!currentShift)
      throw new NotFoundException('Không tìm thấy ca làm việc');
    if (!myBusiness)
      throw new NotFoundException('Không tìm thấy thông tin công ty');

    // 3. Quyết định Checkin hay Checkout
    if (!previousAttendance) {
      return this.handleCheckin(
        userId,
        businessId,
        now,
        dto,
        currentShift,
        myBusiness,
      );
    }

    return this.handleCheckout(
      previousAttendance._id.toString(),
      now,
      dto,
      currentShift,
      myBusiness,
    );
  }

  private async handleCheckin(
    userId: string,
    businessId: string,
    now: Dayjs,
    dto: CreateAttendanceDto,
    shift: ShiftDocument,
    business: BusinessDocument,
  ) {
    try {
      const { earlyCheckinMinutes = 0, graceCheckinMinutes = 0 } = business;

      // Tính toán thời mốc
      const shiftStart = this.getDateTime(now, shift.startTime);
      const timeAllowEarly = shiftStart.subtract(earlyCheckinMinutes, 'minute');
      const timeAllowLate = shiftStart.add(graceCheckinMinutes, 'minute');

      let status: CheckinStatus;
      if (now.isBefore(timeAllowEarly)) {
        const diff = timeAllowEarly.diff(now, 'minute');
        return {
          type: 'NOT_YET',
          message: `Quá sớm để checkin, vui lòng đợi thêm ${diff} phút`,
        };
      }

      status = now.isAfter(timeAllowLate) ? 'LATE' : 'ON_TIME';

      const newAttendance = await this.attendanceModel.create({
        user: new Types.ObjectId(userId),
        business: new Types.ObjectId(businessId),
        shift: shift._id,
        checkinTime: now.toDate(),
        statusCheckin: status as any,
        workDate: now.startOf('day').toDate(),
        checkinLocation: this.formatLocation(dto.location),
      });

      return {
        message: status === 'LATE' ? 'Checkin muộn' : 'Checkin thành công',
        data: newAttendance,
      };
    } catch (error: any) {
      // Kiểm tra mã lỗi 11000 của MongoDB
      if (error?.code === 11000) {
        throw new BadRequestException(
          'Bạn đã chấm công cho ca làm việc này hôm nay rồi',
        );
      }
      // Các lỗi khác thì ném tiếp ra ngoài
      throw error;
    }
  }

  private async handleCheckout(
    attendanceId: string,
    now: Dayjs,
    dto: CreateAttendanceDto,
    shift: any,
    business: any,
  ) {
    const { lateCheckoutMinutes = 0, graceCheckoutMinutes = 0 } = business;

    // Quan trọng: Lấy mốc thời gian dựa trên ngày "now"
    const shiftEnd = this.getDateTime(now, shift.endTime);
    const timeLimitLate = shiftEnd.add(lateCheckoutMinutes, 'minute');
    const timeAllowEarly = shiftEnd.subtract(graceCheckoutMinutes, 'minute');

    if (now.isAfter(timeLimitLate)) {
      return {
        type: 'LATE_LIMIT',
        message: 'Đã hết giờ checkout, vui lòng liên hệ admin',
      };
    }

    const statusCheckout = now.isSameOrAfter(timeAllowEarly)
      ? AttendanceCheckoutStatus.ON_TIME
      : AttendanceCheckoutStatus.EARLY;

    const updatedAttendance = await this.attendanceModel.findByIdAndUpdate(
      attendanceId,
      {
        $set: {
          checkoutTime: now.toDate(),
          statusCheckout: statusCheckout,
          checkoutLocation: this.formatLocation(dto.location),
        },
      },
      { new: true }, // Trả về bản ghi sau khi update
    );

    return {
      message:
        statusCheckout === AttendanceCheckoutStatus.EARLY
          ? 'Checkout sớm'
          : 'Checkout thành công',
      data: updatedAttendance,
    };
  }

  // Helper: Chuyển HH:mm:ss thành Dayjs object của ngày hiện tại
  private getDateTime(baseDate: Dayjs, timeStr: string): Dayjs {
    return dayjs(
      `${baseDate.format('YYYY-MM-DD')} ${timeStr}`,
      'YYYY-MM-DD HH:mm:ss',
    );
  }

  // Helper: Format location GeoJSON
  private formatLocation(location?: [number, number]) {
    if (!location || location.length !== 2) return undefined;
    return {
      type: 'Point' as const, // Thêm 'as const' ở đây
      coordinates: location,
    };
  }
}
