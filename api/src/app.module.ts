import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './guard/roles.guard';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { HealthModule } from './modules/health/health.module';
import { LicenseModule } from './modules/license/license.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AttendancesModule } from './modules/attendances/attendances.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
        retryDelay: 3000,
        autoIndex: configService.get<string>('NODE_ENV') === 'dev',
      }),
    }),
    UsersModule,
    AuthModule,
    LicenseModule,
    SystemConfigModule,
    HealthModule,
    BusinessModule,
    ShiftsModule,
    AttendancesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // gọi luôn tại đây khỏi vào trong các module khác rồi khai báo làm gì
  ],
})
export class AppModule {}
