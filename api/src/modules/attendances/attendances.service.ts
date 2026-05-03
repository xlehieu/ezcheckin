import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Attendance,
  AttendanceDocument,
  AttendanceStatus,
} from './schema/attendance.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UserLogin } from '@/modules/auth/dto/auth.dto';
import { Shift, ShiftDocument } from '../shifts/schema/shift.schema';
import dayjs, { Dayjs } from 'dayjs';
import { Business, BusinessDocument } from '../business/schema/business.entity';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { CheckinStatus } from '@/@types/attendance.type';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
@Injectable()
export class AttendancesService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Shift.name)
    private shiftModel: Model<ShiftDocument>,
    @InjectModel(Business.name)
    private businessModel: Model<BusinessDocument>,
  ) {}

  async checkinCheckout(data: CreateAttendanceDto, userLogin: UserLogin) {
    const { sub: userId, businessId } = userLogin;

    const now = dayjs();
    const shifts = await this.shiftModel.find({ business: businessId });
    const myBusiness = await this.businessModel.findById(businessId).lean();
    if (!myBusiness) {
      throw new NotFoundException('Không tìm thấy công ty của bạn');
    }
    const {
      //cho phép chấm công sớm => tính trong ca đó
      earlyCheckinMinutes = 0,
      // cho phép chấm công muộn => tính trong ca đó
      lateCheckoutMinutes = 0,
      // cho phép checkin muộn vẫn tính lương đúng giờ
      graceCheckinMinutes = 0,
      // cho phép checkout sớm vẫn tính lương đúng giờ
      graceCheckoutMinutes = 0,
    } = myBusiness;
    //case chưa checkin
    const currentShift = shifts.find((shift) => {
      let start = dayjs(shift.startTime, 'HH:mm:ss');
      let end = dayjs(shift.endTime, 'HH:mm:ss');

      // ca bình thường
      if (end.isAfter(start)) {
        const timeAllowEarlyCheckin = dayjs(
          shift.startTime,
          'HH:mm:ss',
        ).subtract(earlyCheckinMinutes, 'minute');
        const timeAllowLateChekin = dayjs(shift.startTime, 'HH:mm:ss').add(
          graceCheckinMinutes,
          'minute',
        );
        if (
          now.isSameOrAfter(timeAllowEarlyCheckin) &&
          now.isSameOrBefore(timeAllowLateChekin)
        ) {
          return {
            type: 'ON_TIME',
            message: 'Checkin thành công, đúng giờ',
          };
        } else if (now.isAfter(timeAllowLateChekin)) {
          return {
            type: 'LATE',
            message: 'Checkin muộn',
          };
        }
      }

      // ca qua đêm
      return now.isAfter(start) || now.isBefore(end);
    });
    if (!currentShift) {
      throw new NotFoundException('Không có ca hiện tại');
    }
    const newAttendance = new this.attendanceModel({
      user: new Types.ObjectId(userId),
      business: new Types.ObjectId(businessId),
      shift: new Types.ObjectId(currentShift?.id),
      checkinTime: new Date(),

      // map location nếu có
      location: data.location
        ? {
            type: 'Point',
            coordinates: data.location,
          }
        : undefined,
    });

    const attendance = await newAttendance.save();

    return attendance.toJSON();
  }
  // checkin(
  //   now: Dayjs,
  //   shift: Shift,
  //   earlyCheckinMinutes: number,
  //   graceCheckinMinutes: number,
  // ):
  //   | {
  //       type: CheckinStatus;
  //       message: string;
  //     }
  //   | undefined {
  //   return undefined;
  // }
}
