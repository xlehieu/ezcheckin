import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class GetAttendanceFilterDto {
  @IsOptional()
  shiftId?: string;

  @IsOptional()
  userId?: string;

  @IsNotEmpty()
  @IsDateString()
  fromDate: string;

  @IsNotEmpty()
  @IsDateString()
  toDate: string;
}