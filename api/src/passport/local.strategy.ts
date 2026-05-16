import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { UserLogin } from '@/modules/auth/dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'ezcheckin-local',
) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserLogin> {
    console.log(email,password)
    const user = await this.authService.validateUser({
      email,
      password,
    });
    console.log("user",user)
    if (!user) {
      throw new UnauthorizedException("Thông tin đăng nhập không đúng");
    }
    return user;
  }
}
