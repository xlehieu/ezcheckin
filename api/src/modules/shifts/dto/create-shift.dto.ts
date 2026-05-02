import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: 'Ca sáng' })
  @IsString({ message: 'Tên ca phải là chuỗi' })
  shiftName: string;

  @ApiProperty({ example: '00:00:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime phải có dạng HH:mm:ss',
  })
  startTime: string;

  @ApiProperty({ example: '00:00:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime phải có dạng HH:mm:ss',
  })
  endTime: string;
}
