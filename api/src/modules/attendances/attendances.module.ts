import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from '../business/schema/business.schema';
import { Shift, ShiftSchema } from '../shifts/schema/shift.schema';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { Attendance, AttendanceSchema } from './schema/attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: Shift.name, schema: ShiftSchema },
    ]),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports:[AttendancesService]
})
export class AttendancesModule {}
