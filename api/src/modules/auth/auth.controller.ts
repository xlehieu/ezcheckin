// auth-service/src/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ValidateLoginDto,
  RegisterDto,
  UserLogin,
  RefreshTokenDto,
} from './dto/auth.dto';
import { Public } from '@/decorator/public.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from '@/passport/local-auth.guard';

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
    @Session() session,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // session
    return this.authService.login(req.user);
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
