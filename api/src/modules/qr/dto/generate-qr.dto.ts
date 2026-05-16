import { CreateAttendanceDto } from '@/modules/attendances/dto/create-attendance.dto';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class QRGenerateDto {
  @IsNotEmpty({message:"Thiếu ca làm việc"})
  @Type(() => String)
  @ApiProperty()
  shiftId:string
}

export class VerifyQRAttendance extends OmitType(
  CreateAttendanceDto,
  ['shiftId'] as const,
){
  @IsNotEmpty({message:"Thiếu token"})
  @Type(() => String)
  @ApiProperty()
  token:string
}