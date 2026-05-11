import { UserLogin } from '@/modules/auth/dto/auth.dto';
import { QueryListDto } from '@/shared/dto/query.dto';
import { buildSearchQueryMongodb } from '@/utils/queryMongo.utils';
import { buildPagination } from '@/utils/response.utils';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift, ShiftDocument } from './schema/shift.schema';

@Injectable()
export class ShiftsService {
  private logger = new Logger(ShiftsService.name);
  constructor(
    @InjectModel(Shift.name) private shiftModel: Model<ShiftDocument>,
  ) {}

  // 1. Create
  async create(data: CreateShiftDto, creator: UserLogin) {
    const newShift = new this.shiftModel({
      ...data,
      business: new Types.ObjectId(creator.businessId),
    });

    const shift = await newShift.save();
    return shift.toJSON();
  }

  // 2. Find all (có search + pagination)
  async findAll(queryDto: QueryListDto, userLogin: UserLogin) {
    const { search, current = 1, pageSize = 10 } = queryDto;
    const { businessId } = userLogin;

    const query: QueryFilter<Shift> = {};
    query.business = businessId;

    if (search) {
      query.$or = buildSearchQueryMongodb<Shift>(search, ['shiftName']);
    }

    const skip = (current - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.shiftModel
        .find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean(),
      this.shiftModel.countDocuments(query),
    ]);
    return buildPagination({
      data,
      total,
      current,
      pageSize,
    });
  }

  // 3. Find one
  async findOne(id: string, userLogin: UserLogin) {
    const { businessId } = userLogin;

    const shift = await this.shiftModel
      .findOne({
        _id: id,
        business: businessId,
      })
      .exec();

    if (!shift) {
      throw new NotFoundException('Không tìm thấy ca làm việc');
    }

    return shift;
  }

  // 4. Update
  async update(id: string, updateData: UpdateShiftDto, userLogin: UserLogin) {
    const { businessId } = userLogin;

    const updated = await this.shiftModel
      .findOneAndUpdate(
        {
          _id: id,
          business: businessId,
        },
        { $set: updateData },
        { returnDocument: 'after' },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Không tìm thấy ca làm việc để cập nhật');
    }

    return updated.toJSON();
  }
  async toggleStatus(id: string, userLogin: UserLogin) {
    const { businessId } = userLogin;
    const updated = await this.shiftModel
      .findOneAndUpdate(
        {
          _id: id,
          business: businessId,
        },
        [
          {
            $set: {
              isActive: { $not: '$isActive' },
            },
          },
        ],
        { returnDocument: 'after', updatePipeline: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException('Không tìm thấy ca làm việc để cập nhật');
    }

    return updated.toJSON();
  }

  // 5. Soft delete
  async softDelete(id: string, userLogin: UserLogin) {
    const { businessId } = userLogin;

    const result = await this.shiftModel.findOneAndUpdate(
      {
        _id: id,
        business: businessId,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { returnDocument: 'after' },
    );

    if (!result) {
      throw new NotFoundException('Không tìm thấy ca làm việc để xóa');
    }

    return { message: 'Xóa ca làm việc thành công' };
  }

  // 6. Restore
  async restore(id: string, userLogin: UserLogin) {
    const { businessId } = userLogin;

    return this.shiftModel.findOneAndUpdate(
      {
        _id: id,
        business: businessId,
      },
      {
        isDeleted: false,
        deletedAt: null,
      },
      { returnDocument: 'after' },
    );
  }
}
