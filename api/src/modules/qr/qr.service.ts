import { QRGenerateResponse, QRTokenPayload } from '@/@types/qr.type';
import { RedisService } from '@/shared/redis/redis.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);
  private readonly QR_TTL_SECONDS = 15 * 60; // 15 minutes
  private readonly QR_KEY_PREFIX = 'qr:token:';

  constructor(private redisService: RedisService) {}

  /**
   * Generate QR token và QR code image
   * @param userId - ID của user
   * @returns QRGenerateResponse with token, qrCode image, and expiration info
   */
  async generateQrToken(
    businessId: string,
    shiftId: string,
  ): Promise<QRGenerateResponse> {
    try {
      // Generate unique token
      const token = randomBytes(32).toString('hex');
      const redisKey = `${this.QR_KEY_PREFIX}${token}`;

      // Create payload
      const payload: QRTokenPayload = {
        token,
        businessId,
        shiftId,
        timestamp: Date.now(),
      };

      // Store in Redis with TTL
      await this.redisService.set(redisKey, payload, this.QR_TTL_SECONDS);

      //   // Generate QR code image (Base64)
      //   const qrCode = await qrcode.toDataURL(token, {
      //     errorCorrectionLevel: 'H',
      //     type: 'image/png',
      //     quality: 0.95,
      //     margin: 1,
      //     width: 300,
      //   });

      // const expiresAt = Date.now() + this.QR_TTL_SECONDS * 1000;

      this.logger.log(
        `QR token generated for businessId ${businessId} and shiftId ${shiftId}`,
      );

      return {
        token,
      };
    } catch (error) {
      this.logger.error(
        `Error generate for businessId ${businessId} and shiftId ${shiftId}`,
        error,
      );
      throw new BadRequestException('Failed to generate QR token');
    }
  }

  /**
   * Verify QR token khi scanner quét
   * @param token - Token từ QR code
   * @returns QRVerifyResponse with validity and user info
   */
  async verifyQrToken(token: string) {
    const redisKey = `${this.QR_KEY_PREFIX}${token}`;

    // Get token from Redis
    const payload = await this.redisService.get<QRTokenPayload>(redisKey);

    if (!payload) {
      throw new BadGatewayException('QR token không tồn tại hoặc đã hết hạn');
    }

    await this.redisService.delete(redisKey);

    return {
      valid: true,
      payload,
      message: 'QR token hợp lệ',
    };
  }

  /**
   * Invalidate QR token (khi FE tự sinh QR mới hoặc logout)
   * @param token - Token cần invalidate
   */
  async invalidateQrToken(token: string): Promise<boolean> {
    try {
      const redisKey = `${this.QR_KEY_PREFIX}${token}`;
      const deleted = await this.redisService.delete(redisKey);

      if (deleted) {
        this.logger.log(`QR token ${token} invalidated`);
      }

      return deleted;
    } catch (error) {
      this.logger.error(`Error invalidating QR token:`, error);
      throw new BadRequestException('Failed to invalidate QR token');
    }
  }

  /**
   * Get QR token info
   * @param token - Token cần check
   */
  async getQrTokenInfo(token: string): Promise<QRTokenPayload | null> {
    try {
      const redisKey = `${this.QR_KEY_PREFIX}${token}`;
      return await this.redisService.get<QRTokenPayload>(redisKey);
    } catch (error) {
      this.logger.error(`Error getting QR token info:`, error);
      throw new BadRequestException('Failed to get QR token info');
    }
  }

  /**
   * Check QR token TTL (còn bao lâu)
   * @param token - Token cần check
   */
  async getQrTokenTtl(token: string): Promise<number> {
    try {
      const redisKey = `${this.QR_KEY_PREFIX}${token}`;
      return await this.redisService.ttl(redisKey);
    } catch (error) {
      this.logger.error(`Error getting QR token TTL:`, error);
      throw new BadRequestException('Failed to get QR token TTL');
    }
  }
}
