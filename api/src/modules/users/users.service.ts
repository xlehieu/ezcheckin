import { HASH_SALT } from '@/shared/constants/index.const';
import { buildSearchQueryMongodb } from '@/utils/queryMongo.utils';
import { buildPagination } from '@/utils/response.utils';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, QueryFilter, Types } from 'mongoose';
import { UserLogin } from '../auth/dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/users.schema';
@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: CreateUserDto, creator: UserLogin) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(data.password, HASH_SALT);
    const newUser = new this.userModel({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: new Types.ObjectId(data.roleId),
      business: new Types.ObjectId(creator.businessId),
    });

    const user = await newUser.save();
    // Mongoose sẽ tự động ẩn password nếu bạn dùng toJSON/toObject với cấu hình chuẩn
    return user.toJSON();
  }
  async findAll(queryListDto: QueryUserDto, userLogin: UserLogin) {
    const { search, status, role, current, pageSize } = queryListDto;
    const { businessId } = userLogin;
    // Khởi tạo object filter
    const query: QueryFilter<User> = {};
    query.business = businessId;

    if (search) {
      query.$or = buildSearchQueryMongodb<User>(search, ['fullName', 'email']);
    }
    if (role) query.role = role;
    if (status) query.status = status;
    // 3. Phân trang (Pagination)
    // this.logger.debug(JSON.stringify(query));
    const skip = ((current || 1) - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate({
          path: 'role',
          select: 'name',
        })
        .lean(),
      this.userModel.countDocuments(query),
    ]);
    return buildPagination({
      data,
      total,
      current: query.current,
      pageSize: query.pageSize,
    });
  }
  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('role')
      .populate('business')
      .exec();

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  /**
   * Cập nhật thông tin user
   */
  async update(id: string, updateData: UpdateUserDto) {
    const data: any = { ...updateData };

    // Nếu có cập nhật password
    if (data.password) {
      data.password = await bcrypt.hash(data.password, HASH_SALT);
    }

    // Nếu cập nhật roleId hoặc businessId thì map sang ObjectId
    if (data.roleId) data.role = new Types.ObjectId(data.roleId);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Không tìm thấy người dùng để cập nhật');
    }

    return updatedUser.toJSON();
  }

  /**
   * Xóa mềm (Soft Delete)
   */
  async softDelete(id: string) {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Không tìm thấy người dùng để xóa');
    }

    return { message: 'Xóa người dùng thành công' };
  }

  /**
   * Khôi phục người dùng đã xóa mềm
   */
  async restore(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true },
    );
  }
}
