// auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from '@/passport/jwt.strategy';
import { LocalStrategy } from '@/passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { Business, BusinessSchema } from '../business/schema/business.entity';
import { License, LicenseSchema } from '../license/schema/license.schema';
import {
  SystemConfig,
  SystemConfigSchema,
} from '../system-config/schema/system-config.schema';
import {
  Permission,
  PermissionSchema,
} from '../users/schema/permission.schema';
import { Role, RoleSchema } from '../users/schema/role.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schema/refresh-token.schema';

@Module({
  imports: [
    // Thêm dòng này
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: License.name, schema: LicenseSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: SystemConfig.name, schema: SystemConfigSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
