import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryListDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  current: number = 1;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  pageSize: number = 20;

  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional()
  search?: string;

  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  status?: boolean;
}
