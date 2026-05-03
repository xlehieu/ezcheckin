import { Body, Controller, Post, Request } from '@nestjs/common';
import { UserLogin } from '../auth/dto/auth.dto';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post("checkin-checkout")
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.attendancesService.checkinCheckout(createAttendanceDto, req.user);
  }
}
