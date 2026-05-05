import { BusinessDocument } from '@/modules/business/schema/business.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Aggregate,
  Document,
  Schema as MongooseSchema,
  Query,
  Types,
} from 'mongoose';

export type UserDocument = User & Document;
export enum RoleName {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}
@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      delete ret.password; // Cứ biến thành JSON là mất password
      return ret;
    },
  },
})
export class User {
  @Prop()
  fullName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false }) // select: false để không tự động trả về password khi query
  password: string;

  @Prop({ unique: true, sparse: true })
  employeeCode: string; // Mã nhân viên (ví dụ: NV001)

  @Prop({
      type: String,
      required: true,
      enum: Object.values(RoleName), // Chỉ cho phép các giá trị trong enum
      default: RoleName.EMPLOYEE,
    })
    role: RoleName; // Ví dụ: "ADMIN", "MANAGER", "EMPLOYEE"

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Business',
  })
  business: Types.ObjectId | BusinessDocument;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre(/^find/, function (this: Query<any, any>) {
  if (!this.getOptions().skipIsDeletedFilter) {
    this.where({ isDeleted: false });
  }
} as any);

UserSchema.pre('countDocuments', function (this: Query<any, any>) {
  if (!this.getOptions().skipIsDeletedFilter) {
    this.where({ isDeleted: false });
  }
} as any);
// Lọc cho aggregate (Lưu ý: aggregate dùng 'this.pipeline()')
// Lọc cho aggregate (Dùng unshift để đẩy điều kiện match lên đầu pipeline)
UserSchema.pre('aggregate' as any, function (this: Aggregate<any>) {
  if (!this.options || !this.options.skipIsDeletedFilter) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
  }
});
