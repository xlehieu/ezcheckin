import { QRGenerateResponse, QRVerifyResponse } from '@/@types/qr.type';
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
import { QRGenerateDto } from './dto/generate-qr.dto';
import { QrService } from './qr.service';

@ApiTags('QR')
@Controller('qr')
@ApiBearerAuth()
export class QrController {
  constructor(private qrService: QrService) {}

  @Get('generate')
  @ApiOperation({ summary: 'Generate QR token và QR code image' })
  async generateQr(
    @Query() shift: QRGenerateDto,
    @Request() req: AppRequest,
  ): Promise<QRGenerateResponse> {
    const userId = req.user.sub;
    return this.qrService.generateQrToken(userId, shift.shiftId);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify QR token khi scanner quét' })
  async verifyQr(
    @Body() body: { token: string },
    @Request() req: AppRequest,
  ): Promise<QRVerifyResponse> {
    return this.qrService.verifyQrToken(body.token, req.user.sub);
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
