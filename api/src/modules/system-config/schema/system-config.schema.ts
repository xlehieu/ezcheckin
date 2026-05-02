import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemConfigDocument = SystemConfig & Document;

@Schema({ timestamps: true })
export class SystemConfig {
  @Prop({ default: false })
  checkLicense!: boolean;
}

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig);
