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
import { ShiftsService } from './shifts.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Roles } from '@/decorator/roles.decorator';
import { UserLogin } from '@/modules/auth/dto/auth.dto';
import { QueryListDto } from '@/shared/dto/query.dto';
import { RoleName } from '../users/schema/users.schema';

@Controller('shifts')
@ApiTags('Shifts')
@ApiBearerAuth()
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  // 1. Create
  @Post()
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Tạo ca làm việc mới' })
  @ApiBody({ type: CreateShiftDto })
  async create(
    @Body() data: CreateShiftDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.shiftsService.create(data, req.user);
  }

  // 2. Find all (có query + pagination)
  @Get()
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy danh sách ca làm việc' })
  async findAll(
    @Query() query: QueryListDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.shiftsService.findAll(query, req.user);
  }

  // 3. Find one
  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy chi tiết ca làm việc' })
  async findOne(@Param('id') id: string, @Request() req: { user: UserLogin }) {
    return this.shiftsService.findOne(id, req.user);
  }

  // 4. Update
  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Cập nhật ca làm việc' })
  @ApiBody({ type: UpdateShiftDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateShiftDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.shiftsService.update(id, data, req.user);
  }

  @Patch('/toggle/:id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Toggle status' })
  async toggleStatus(
    @Param('id') id: string,
    @Request() req: { user: UserLogin },
  ) {
    return this.shiftsService.toggleStatus(id, req.user);
  }

  // 5. Soft delete
  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Xóa mềm ca làm việc' })
  async remove(@Param('id') id: string, @Request() req: { user: UserLogin }) {
    return this.shiftsService.softDelete(id, req.user);
  }

  // 6. Restore
  @Post(':id/restore')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Khôi phục ca làm việc đã xóa' })
  async restore(@Param('id') id: string, @Request() req: { user: UserLogin }) {
    return this.shiftsService.restore(id, req.user);
  }
}
