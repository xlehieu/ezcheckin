import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './schema/attendance.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UserLogin } from '@/modules/auth/dto/auth.dto';
import { Shift, ShiftDocument } from '../shifts/schema/shift.schema';
import dayjs from 'dayjs';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Shift.name)
    private shiftModel: Model<ShiftDocument>,
  ) {}

  async create(data: CreateAttendanceDto, userLogin: UserLogin) {
    const { _id: userId, businessId } = userLogin;

    const now = dayjs();
    const shifts = await this.shiftModel.find({ business: businessId });

    const currentShift = shifts.find((shift) => {
      const start = dayjs(shift.startTime, 'HH:mm:ss');
      const end = dayjs(shift.endTime, 'HH:mm:ss');

      // ca bình thường
      if (end.isAfter(start)) {
        return now.isAfter(start) && now.isBefore(end);
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
}
