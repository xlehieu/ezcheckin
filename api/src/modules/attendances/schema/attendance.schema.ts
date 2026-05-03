import { BusinessDocument } from '@/modules/business/schema/business.entity';
import { ShiftDocument } from '@/modules/shifts/schema/shift.schema';
import { UserDocument } from '@/modules/users/schema/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type AttendanceDocument = Attendance & Document;
export enum AttendanceStatus {
  ON_TIME="ON_TIME",
  LATE="LATE",
  ABSENT="ABSENT"
}
@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId | UserDocument;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  business: Types.ObjectId | BusinessDocument;

  @Prop({ type: Types.ObjectId, ref: 'Shift', required: true, index: true })
  shift: Types.ObjectId | ShiftDocument;

  @Prop({ required: true })
  checkinTime: Date;

  @Prop()
  checkoutTime?: Date;

  @Prop({
    enum: Object.values(AttendanceStatus),
    default: AttendanceStatus.ON_TIME,
  })
  status: AttendanceStatus;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  })
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ location: '2dsphere' });

// ❗ Tránh checkin 2 lần trong 1 ca
AttendanceSchema.index({ user: 1, shift: 1, business: 1 }, { unique: true });
