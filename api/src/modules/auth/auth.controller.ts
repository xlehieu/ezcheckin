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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  RegisterDto,
  UserLogin,
  ValidateLoginDto,
} from './dto/auth.dto';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  private cookieOptions:any={
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
      path: '/',
    }
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
  ) {
    const { access_token,refresh_token  } = await this.authService.login(
      req.user,
    );
    // deploy đoạn này FE Nextjs server component không lấy được cookie=> không gửi kèm cookie được
    res.setCookie('refresh_token', refresh_token, {
      ...this.cookieOptions
    });
    res.setCookie('access_token', access_token, {
      ...this.cookieOptions
    });
    return true
  }

  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  @HttpCode(200)
  async refresh(
    @Request() req: { user: UserLogin },
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.setCookie('refresh_token', access_token, {
      ...this.cookieOptions
    });
    res.setCookie('access_token', refresh_token, {
      ...this.cookieOptions
    });
    return {
      access_token,
      refresh_token
    };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Body() data: { refreshToken: string }) {
    return this.authService.logout(data.refreshToken);
  }
}
