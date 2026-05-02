import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { Permission } from './permission.schema';

export type RoleDocument = Role & Document;
export enum RoleName {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}
@Schema({ timestamps: true })
export class Role {
  @Prop({
    type: String,
    required: true,
    unique: true,
    enum: Object.values(RoleName), // Chỉ cho phép các giá trị trong enum
    default: RoleName.EMPLOYEE,
  })
  name: RoleName; // Ví dụ: "ADMIN", "MANAGER", "EMPLOYEE"

  @Prop()
  description: string;

  // Tham chiếu đến danh sách PermissionId
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Permission' }] })
  permissions: Types.ObjectId[] | Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
