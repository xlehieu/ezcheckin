import { QueryListDto } from '@/shared/dto/query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleName } from '../schema/users.schema';

export class QueryUserDto extends QueryListDto {
  @IsOptional()
  @IsEnum(RoleName) // Đảm bảo giá trị gửi lên phải thuộc Enum
  @ApiPropertyOptional({ enum: RoleName })
  role?: RoleName;
}
