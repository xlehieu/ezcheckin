import { PolygonDto } from '@/shared/dto/polygon.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({
    example: 'Công ty ABC',
    description: 'Tên doanh nghiệp',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: [
      [106.7, 10.77],
      [106.705, 10.77],
    ],
  })
  @IsOptional()
  @IsArray({ each: true, message: 'Phải là dạng mảng 2 chiều' })
  @IsArray({ each: true, message: 'Phải là dạng mảng 2 chiều' })
  location?: number[][];

  @ApiPropertyOptional({
    example: 10,
    description: 'Số phút cho phép checkin sớm',
  })
  @IsOptional()
  @IsNumber()
  earlyCheckinMinutes?: number;

  @ApiPropertyOptional({
    example: 15,
    description: 'Số phút cho phép checkout muộn',
  })
  @IsOptional()
  @IsNumber()
  lateCheckoutMinutes?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Số phút checkin muộn vẫn tính đúng giờ',
  })
  @IsOptional()
  @IsNumber()
  graceCheckinMinutes?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Số phút checkout sớm vẫn tính đủ lương',
  })
  @IsOptional()
  @IsNumber()
  graceCheckoutMinutes?: number;
}
