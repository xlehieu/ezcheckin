import { BusinessDocument } from '@/modules/business/schema/business.entity';
import { ShiftDocument } from '@/modules/shifts/schema/shift.schema';
import { UserDocument } from '@/modules/users/schema/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type AttendanceDocument = Attendance & Document;
export enum AttendanceCheckinStatus {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
}

export enum AttendanceCheckoutStatus {
  ON_TIME = 'ON_TIME',
  EARLY = 'EARLY',
}

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId | UserDocument;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  business: Types.ObjectId | BusinessDocument;

  @Prop({ type: Types.ObjectId, ref: 'Shift', required: true, index: true })
  shift: Types.ObjectId | ShiftDocument;

  @Prop({ required: true, index: true })
  workDate: Date;

  @Prop({ required: true })
  checkinTime: Date;

  @Prop({ type: Date, default: null })
  checkoutTime: Date | null;

  @Prop({
    enum: Object.values(AttendanceCheckinStatus),
    default: AttendanceCheckinStatus.ON_TIME,
  })
  statusCheckin: AttendanceCheckinStatus;

  @Prop({
    type: String,
    enum: Object.values(AttendanceCheckoutStatus),
    default: null,
  })
  statusCheckout: AttendanceCheckoutStatus;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  })
  checkinLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: [Number],
  })
  checkoutLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ checkinLocation: '2dsphere' });
AttendanceSchema.index({ checkoutLocation: '2dsphere' });

AttendanceSchema.index(
  { user: 1, business: 1, shift: 1, workDate: 1 },
  { unique: true },
);
