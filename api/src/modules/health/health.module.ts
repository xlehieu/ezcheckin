// src/modules/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TerminusModule,
    MongooseModule, // Cần thiết để MongooseHealthIndicator hoạt động
  ],
  controllers: [HealthController],
})
export class HealthModule {}
