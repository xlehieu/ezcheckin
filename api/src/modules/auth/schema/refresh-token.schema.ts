import { User, UserDocument } from '@/modules/users/schema/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: false }, // Tự động tạo created_at
  collection: 'refresh_tokens',
})
export class RefreshToken {
  @Prop({ required: true, unique: true, index: true })
  token!: string;

  // Lưu ID của User dưới dạng ObjectId để tham chiếu
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId | UserDocument;

  @Prop({ required: true })
  expires_at!: Date;

  // Bạn có thể thêm deviceInfo để quản lý thiết bị nào đang đăng nhập
  @Prop({ type: Object })
  deviceInfo?: {
    browser?: string;
    os?: string;
    ip?: string;
  };
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// Thêm index để tự động xóa token khi hết hạn (TTL Index)
// Điều này giúp DB của bạn luôn sạch sẽ, không bị rác bởi các token cũ
RefreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
