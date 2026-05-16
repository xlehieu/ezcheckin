import { RedisModule } from '@/shared/redis/redis.module';
import { Module } from '@nestjs/common';
import { AttendancesModule } from '../attendances/attendances.module';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';

@Module({
  imports: [
    RedisModule,
    AttendancesModule,
  ],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {}
