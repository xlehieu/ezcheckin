import { BusinessDocument } from '@/modules/business/schema/business.entity';
import { User } from '@/modules/users/schema/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type LicenseDocument = License & Document;
export enum PLAN_TYPE {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}
@Schema({ timestamps: true })
export class License {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Business',
    required: true,
  })
  business!: Types.ObjectId | BusinessDocument;

  @Prop({
    required: true,
    enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'],
    default: 'FREE',
  })
  planType!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date; // Ngày hết hạn tài khoản

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  paymentId?: string; // Lưu mã giao dịch để đối soát sau này
}

export const LicenseSchema = SchemaFactory.createForClass(License);
