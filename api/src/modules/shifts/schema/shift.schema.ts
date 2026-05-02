import { BusinessDocument } from '@/modules/business/schema/business.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Aggregate,
  Document,
  Schema as MongooseSchema,
  Query,
  Types,
} from 'mongoose';
export type ShiftDocument = Shift & Document;
@Schema({ timestamps: true })
export class Shift {
  @Prop({ required: true })
  shiftName: string;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Business',
    required: true,
  })
  business!: Types.ObjectId | BusinessDocument;

  @Prop({ required: true })
  startTime!: string;
  @Prop({ required: true })
  endTime!: string;
  @Prop({ type: Boolean, default: true })
  isActive!: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}
export const ShiftSchema = SchemaFactory.createForClass(Shift);
ShiftSchema.pre(/^find/, function (this: Query<any, any>) {
  if (!this.getOptions().skipIsDeletedFilter) {
    this.where({ isDeleted: false });
  }
} as any);

ShiftSchema.pre('countDocuments', function (this: Query<any, any>) {
  if (!this.getOptions().skipIsDeletedFilter) {
    this.where({ isDeleted: false });
  }
} as any);

// Lọc cho aggregate (Lưu ý: aggregate dùng 'this.pipeline()')
// Lọc cho aggregate (Dùng unshift để đẩy điều kiện match lên đầu pipeline)
ShiftSchema.pre('aggregate' as any, function (this: Aggregate<any>) {
  if (!this.options || !this.options.skipIsDeletedFilter) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
  }
});
