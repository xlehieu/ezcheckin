// auth-service/src/auth.controller.ts
import { Public } from '@/decorator/public.decorator';
import { LocalAuthGuard } from '@/passport/local-auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  RegisterDto,
  UserLogin,
  ValidateLoginDto,
} from './dto/auth.dto';
import type { FastifyReply } from 'fastify';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.registerRoleAdmin(data);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: ValidateLoginDto })
  @UseGuards(LocalAuthGuard)
  //request này được lấy ra từ guard LocalAuthGuard => LocalStrategy
  async login(
    @Request() req: { user: UserLogin },
    @Res({ passthrough: true }) res: FastifyReply,
  ){
    const { accessToken, refreshToken } = await this.authService.login(req.user);

  res.setCookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: false, // chỉ gửi qua https hay không
    sameSite: 'lax',
    path: '/',
  });
  res.setCookie("access_token",accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  })
    return true
  }

  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  @HttpCode(200)
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refresh(data.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Body() data: { refreshToken: string }) {
    return this.authService.logout(data.refreshToken);
  }
}
