import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@/decorator/roles.decorator';
import { UserLogin } from '../auth/dto/auth.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { RoleName } from './schema/users.schema';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() data: CreateUserDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.userService.createUser(data, req.user);
  }
  @Get()
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy danh sách user' })
  async findAll(
    @Query() query: QueryUserDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.userService.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy chi tiết người dùng' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
@Get('my-profile')
  @ApiOperation({ summary: 'Profile' })
  async getMyProfile(@Request() req:{user:UserLogin}) {
    return this.userService.findOne(req.user.sub);
  }
  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.userService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN) // Chỉ Admin mới có quyền xóa
  @ApiOperation({ summary: 'Xóa mềm người dùng' })
  async remove(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }

  @Post(':id/restore')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Khôi phục người dùng đã xóa' })
  async restore(@Param('id') id: string) {
    return this.userService.restore(id);
  }
}
