import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Tất cả các fields từ CreateUserDto (fullName, email, password, roleId)
  // giờ đây đã có sẵn trong này và đều là Optional.

  // Bạn có thể thêm các field chỉ dành riêng cho việc cập nhật ở đây:

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  employeeCode?: string;
}
