import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { buildPagination } from '@/utils/response.utils';
import { UserLogin } from '../auth/dto/auth.dto';
import { Business, BusinessDocument } from './schema/business.schema';

@Injectable()
export class BusinessService {
  private logger = new Logger(BusinessService.name);

  constructor(
    @InjectModel(Business.name)
    private businessModel: Model<BusinessDocument>,
  ) {}

  // 🔥 CREATE
  // async create(dto: CreateBusinessDto, userLogin: UserLogin) {
  //   const data = { ...dto };

  //   if (dto.location?.type === 'Polygon') {
  //     data.location = {
  //       type: 'Polygon',
  //       coordinates: dto.location.coordinates,
  //     };
  //   }
  //   const business = await this.businessModel.create(data);
  //   return business.toJSON();
  // }

  // 🔥 FIND ALL (có thể filter theo admin nếu cần)
  // async findAll(queryDto: any) {
  //   const { search, current = 1, pageSize = 10 } = queryDto;

  //   const query: QueryFilter<Business> = {};

  //   query.admin = userLogin.sub;

  //   if (search) {
  //     query.name = { $regex: search, $options: 'i' };
  //   }

  //   const skip = (current - 1) * pageSize;

  //   const [data, total] = await Promise.all([
  //     this.businessModel
  //       .find(query)
  //       .skip(skip)
  //       .limit(pageSize)
  //       .sort({ createdAt: -1 })
  //       .populate('admin', 'fullName email')
  //       .lean(),

  //     this.businessModel.countDocuments(query),
  //   ]);

  //   return buildPagination({
  //     data,
  //     total,
  //     current,
  //     pageSize,
  //   });
  // }

  // 🔥 FIND ONE
  async findOne(id: string, userLogin: UserLogin) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID không hợp lệ');
    }

    const business = await this.businessModel.findOne({
      _id: id,
      admin: userLogin.sub,
    });

    if (!business) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp');
    }

    return business;
  }

  // 🔥 UPDATE
  async update(id: string, dto: UpdateBusinessDto, userLogin: UserLogin) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID không hợp lệ');
    }

    const data = { ...dto };
    const dataJ = await this.businessModel.findOne({_id:id})
    this.logger.log("dataJ",dataJ)
    const updated = await this.businessModel.findOneAndUpdate(
      {
        _id: id,
        admin: userLogin.sub, // 👉 bảo mật
      },
      { $set: data },
      { returnDocument: 'after'},
    );

    if (!updated) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp để cập nhật');
    }

    return updated.toJSON();
  }

  // 🔥 DELETE
  async remove(id: string, userLogin: UserLogin) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID không hợp lệ');
    }

    const deleted = await this.businessModel.findOneAndDelete({
      _id: id,
      admin: userLogin.sub,
    });

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy doanh nghiệp để xóa');
    }

    return { message: 'Xóa thành công' };
  }
}