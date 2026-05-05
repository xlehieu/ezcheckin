import { HASH_SALT } from '@/shared/constants';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { lowerCase, startCase } from 'lodash';
import { Connection, Model, Types } from 'mongoose';
import { Business, BusinessDocument } from '../business/schema/business.schema';
import { License, LicenseDocument } from '../license/schema/license.schema';
import {
  SystemConfig,
  SystemConfigDocument,
} from '../system-config/schema/system-config.schema';
import { RoleName, User, UserDocument } from '../users/schema/users.schema';
import { RegisterDto, UserLogin, ValidateLoginDto } from './dto/auth.dto';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schema/refresh-token.schema';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private tokenModel: Model<RefreshTokenDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(License.name) private licenseModel: Model<LicenseDocument>,
    @InjectModel(SystemConfig.name)
    private systemConfigModel: Model<SystemConfigDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async registerRoleAdmin(data: RegisterDto) {
    const existing = await this.userModel.findOne({ email: data.email }).lean();
    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }
    const hashedPassword = await bcrypt.hash(data.password, HASH_SALT);

    // --- BẮT ĐẦU TRANSACTION ---
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 1. Khởi tạo ID trước để gán chéo cho nhau (Rõ ràng và chủ động)
      const userId = new Types.ObjectId();
      const businessId = new Types.ObjectId();
      const licenseId = new Types.ObjectId();

      const now = dayjs();

      // 2. Tạo các instance (Truyền session vào options)
      const newUser = new this.userModel({
        _id: userId,
        email: data.email,
        password: hashedPassword,
        role: RoleName.ADMIN,
        business: businessId,
      });

      const newBusiness = new this.businessModel({
        _id: businessId,
        admin: userId,
        license: licenseId,
        location:[]
      });

      const newLicense = new this.licenseModel({
        _id: licenseId,
        business: businessId,
        startDate: now.toDate(),
        endDate: now.add(30, 'day').toDate(),
      });

      // 3. Lưu vào DB kèm theo session
      // Lưu ý: Không dùng Promise.all với session nếu không cần thiết,
      // lưu tuần tự giúp trace lỗi dễ hơn trong transaction.
      await newUser.save({ session });
      await newBusiness.save({ session });
      await newLicense.save({ session });

      // 4. Nếu mọi thứ tốt đẹp -> Chốt đơn!
      await session.commitTransaction();
      return { _id: userId, email: newUser.email };
    } catch (err: any) {
      // 5. Nếu có bất kỳ lỗi nào -> Hủy bỏ mọi thay đổi, DB sạch như mới
      await session.abortTransaction();
      throw err;
    } finally {
      // 6. Luôn luôn đóng session để tránh leak memory
      await session.endSession();
    }
  }

  async login(loginDto: UserLogin) {
    return this.generateTokens(loginDto);
  }

  async refresh(refreshToken: string) {
    // Tìm token trong DB và populate thông tin user
    const stored = await this.tokenModel
      .findOne({ token: refreshToken })
      .populate<{
        user: UserDocument
      }>({
        path: 'user', // Cấp 1: Populate thông tin User
        populate: {
          path: 'role', // Cấp 2: Populate thông tin Role nằm bên trong User
        },
      })
      .lean();
    if (!stored || stored.expires_at < new Date()) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token đã hết hạn hoặc không hợp lệ',
        type: 'EXPIRED_TOKEN',
      });
    }
    // Token Rotation: Xóa token cũ sau khi dùng
    await this.tokenModel.deleteOne({ _id: stored._id });

    // Cấp cặp token mới
    return this.generateTokens({
      sub: stored?.user._id.toString(),
      email: stored?.user.email,
      role: stored?.user.role,
      businessId: stored?.user?.business.toString(),
    });
  }

  async logout(refreshToken: string) {
    await this.tokenModel.deleteOne({ token: refreshToken });
    return { success: true };
  }
  //region generateTokens
  private async generateTokens(user: UserLogin) {
    if (Object.values(user).some((item) => !item)) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi server',
      });
    }
    const payload: UserLogin = {
      sub: user.sub,
      email: user.email,
      role: user.role, // Thêm role vào payload để dùng cho RolesGuard
      businessId: user.businessId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<any>('EXPIRED_ACCESS_TOKEN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    // Lưu Refresh Token vào MongoDB
    await this.tokenModel.create({
      token: refreshToken,
      user: new Types.ObjectId(user.sub),
      expires_at: expiresAt,
    });

    return { accessToken, refreshToken };
  }
  //region validate user
  async validateUser(data: ValidateLoginDto): Promise<UserLogin> {
    const user = await this.userModel
      .findOne({ email: data.email })
      //   dùng + vì trong định nghĩa select là false rồi
      .select('+password')
      .populate<{ business: BusinessDocument & { license: LicenseDocument } }>({
        path: 'business',
        populate: {
          path: 'license',
        },
      });
    // this.logger.debug(user);
    if (!user)
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    const systemConfig = await this.systemConfigModel.findOne().lean();
    const now = dayjs();
    //có system config bật check license và business hết hạn
    const licensBusiness = user?.business?.license;
    if (systemConfig?.checkLicense && now.isAfter(licensBusiness?.endDate)) {
      //update isActive false nếu condition true
      await this.licenseModel.findByIdAndUpdate(licensBusiness._id, {
        isActive: false,
      });
      throw new HttpException(
        `Yêu cầu thanh toán: Gói ${startCase(lowerCase(licensBusiness?.planType))} đã hết hạn.`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');

    return {
      sub: user._id?.toString(),
      email: user.email,
      role: user.role,
      businessId: user.business._id.toString(),
    };
  }
}
