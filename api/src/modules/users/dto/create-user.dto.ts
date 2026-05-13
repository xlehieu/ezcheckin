import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleName } from '../schema/users.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'Lê Xuân Hiếu' })
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  fullName: string;

  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'NV00001' })
  @IsOptional()
  employeeCode: string;

  @ApiProperty({
    enum: RoleName,
    example: RoleName.EMPLOYEE,
  })
  @IsEnum(RoleName, {
    message: 'Role không hợp lệ',
  })
  role: RoleName;
}
