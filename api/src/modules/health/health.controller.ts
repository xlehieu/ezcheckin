// src/modules/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller('health')
@ApiBearerAuth()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 1. Kiểm tra kết nối Database
      () => this.mongoose.pingCheck('mongodb', { timeout: 1500 }),

      // 2. Kiểm tra bộ nhớ RAM (Ví dụ: báo động nếu vượt quá 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
