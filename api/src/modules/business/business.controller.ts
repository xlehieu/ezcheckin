import { Roles } from '@/decorator/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLogin } from '../auth/dto/auth.dto';
import { BusinessService } from '../business/business.service';
import { UpdateBusinessDto } from '../business/dto/update-business.dto';
import { RoleName } from '../users/schema/users.schema';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('business')
@ApiTags('Business')
@ApiBearerAuth()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // 🔥 CREATE
  // @Post()
  // @Roles(RoleName.ADMIN, RoleName.MANAGER)
  // @ApiOperation({ summary: 'Tạo doanh nghiệp' })
  // @ApiBody({ type: CreateBusinessDto })
  // async create(
  //   @Body() data: CreateBusinessDto,
  //   @Request() req: { user: UserLogin },
  // ) {
  //   // return this.businessService.create(data, req.user);
  //   return "API - check payload - no create"
  // }

  // // 🔥 FIND ALL
  // @Get()
  // @Roles(RoleName.ADMIN, RoleName.MANAGER)
  // @ApiOperation({ summary: 'Lấy danh sách doanh nghiệp' })
  // async findAll(
  //   @Query() query: any,
  //   @Request() req: { user: UserLogin },
  // ) {
  //   return this.businessService.findAll(query, req.user);
  // }

  // 🔥 FIND ONE
  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @ApiOperation({ summary: 'Lấy chi tiết doanh nghiệp' })
  async findOne(@Param('id') id: string, @Request() req: { user: UserLogin }) {
    return this.businessService.findOne(id, req.user);
  }

  // 🔥 UPDATE
  @Patch(':id')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Cập nhật doanh nghiệp' })
  @ApiBody({ type: UpdateBusinessDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBusinessDto,
    @Request() req: { user: UserLogin },
  ) {
    return this.businessService.update(id, data, req.user);
  }

  // 🔥 DELETE
  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Xóa doanh nghiệp' })
  async remove(@Param('id') id: string, @Request() req: { user: UserLogin }) {
    return this.businessService.remove(id, req.user);
  }
}
