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
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
BusinessSchema.index({ location: '2dsphere' });
