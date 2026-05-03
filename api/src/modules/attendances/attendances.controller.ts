import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserLogin } from '../auth/dto/auth.dto';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { GetAttendanceFilterDto } from './dto/attendance-filter.dto';
import { Roles } from '@/decorator/roles.decorator';
import { RoleName } from '../users/schema/users.schema';
import { ApiOperation } from '@nestjs/swagger';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  /**
   * Endpoint thực hiện Check-in hoặc Check-out tự động dựa trên trạng thái hiện tại
   */
  @Post('checkin-checkout')
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.attendancesService.checkinCheckout(
      createAttendanceDto,
      req.user,
    );
  }

  /**
   * Lấy danh sách chấm công cho quản lý công ty
   * Cho phép lọc theo userId, shiftId, và khoảng thời gian (fromDate, toDate)
   */
  @Get('business-logs')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy danh sách chấm công' })
  async getBusinessLogs(
    @Request() req: { user: UserLogin },
    @Query() filters: GetAttendanceFilterDto,
  ) {
    const { businessId } = req.user;
    return this.attendancesService.findAllByBusiness(businessId, filters);
  }

  @Get('business-stats')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy danh sách trạng thái chấm công' })
  async getBusinessStats(
    @Request() req: { user: UserLogin },
    @Query('date') date?: string,
  ) {
    const { businessId } = req.user;
    return this.attendancesService.getStats(businessId, date);
  }
}
