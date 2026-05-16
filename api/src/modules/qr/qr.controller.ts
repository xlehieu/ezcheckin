import { QRGenerateResponse } from '@/@types/qr.type';
import type { AppRequest } from '@/@types/req.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QRGenerateDto, VerifyQRAttendance } from './dto/generate-qr.dto';
import { QrService } from './qr.service';
import { AttendancesService } from '../attendances/attendances.service';

@ApiTags('QR')
@Controller('qr')
@ApiBearerAuth()
export class QrController {
  constructor(
    private qrService: QrService,
    private attendanceService: AttendancesService,
  ) {}

  @Get('generate')
  @ApiOperation({ summary: 'Generate QR token và QR code image' })
  async generateQr(
    @Query() shift: QRGenerateDto,
    @Request() req: AppRequest,
  ): Promise<QRGenerateResponse> {
    const userId = req.user.sub;
    return this.qrService.generateQrToken(userId, shift.shiftId);
  }

  @Post('verify/checkin-checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify QR token khi scanner quét' })
  async verifyQrCheckInCheckOut(
    @Body() body: VerifyQRAttendance,
    @Request() req: AppRequest,
  ) {
    const verifyData = await this.qrService.verifyQrToken(body.token);
    return await this.attendanceService.checkinCheckout(
      {
        shiftId: verifyData.payload?.shiftId,
        location: body.location,
      },
      req.user,
    );
  }

  @Delete(':token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Invalidate QR token' })
  async invalidateQr(
    @Param('token') token: string,
  ): Promise<{ success: boolean }> {
    const deleted = await this.qrService.invalidateQrToken(token);
    return { success: deleted };
  }

  @Get('info/:token')
  @ApiOperation({ summary: 'Lấy thông tin QR token' })
  async getQrInfo(@Param('token') token: string) {
    const info = await this.qrService.getQrTokenInfo(token);
    const ttl = await this.qrService.getQrTokenTtl(token);
    return {
      info,
      ttl,
    };
  }
}
