import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class QRGenerateDto {
  @IsNotEmpty({message:"Thiếu ca làm việc"})
  @Type(() => String)
  @ApiProperty()
  shiftId
}
