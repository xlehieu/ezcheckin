import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  action: string;
  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.index({ subject: 1, action: 1 }, { unique: true });
