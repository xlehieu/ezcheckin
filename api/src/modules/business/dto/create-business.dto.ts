import { PolygonDto } from '@/shared/dto/polygon.dto';
import { Type } from 'class-transformer';
import {
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

  @ApiProperty({
    description: 'Vị trí doanh nghiệp dạng Polygon (GeoJSON)',
    type: PolygonDto,
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [106.700, 10.770],
          [106.705, 10.770],
          [106.705, 10.775],
          [106.700, 10.775],
          [106.700, 10.770],
        ],
      ],
    },
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => PolygonDto)
  location: PolygonDto;

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