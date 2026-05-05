import { LicenseDocument } from '@/modules/license/schema/license.schema';
import { UserDocument } from '@/modules/users/schema/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type BusinessDocument = Business & Document;

@Schema({
  timestamps: true,
})
export class Business {
  @Prop({
    type: String,
  })
  name: string;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  admin: Types.ObjectId | UserDocument;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'License',
  })
  license: Types.ObjectId | LicenseDocument;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [[Number]],
    required: true,
  })
  location: number[][];
  // locatio sẽ có dạng
  //   location = {
  //   type: 'Polygon',
  //   coordinates: [
  //     [
  //       [106.700, 10.770],
  //       [106.705, 10.770],
  //       [106.705, 10.775],
  //       [106.700, 10.775],
  //       [106.700, 10.770],
  //     ],
  //   ],
  // };

  @Prop({ type: Number, default: 0 })
  earlyCheckinMinutes?: number;

  @Prop({ type: Number, default: 0 })
  lateCheckoutMinutes?: number;

  @Prop({ type: Number, default: 0 })
  graceCheckinMinutes?: number;

  @Prop({ type: Number, default: 0 })
  graceCheckoutMinutes?: number;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
