import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenType } from '@/@types/token.type';
import type { FastifyRequest } from 'fastify';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject() private readonly configService: ConfigService) {
    super({
       jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest) => {
          return req?.cookies?.access_token ?? null; // 👈 tên cookie của bạn
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string,
    });
  }

  async validate(payload: AccessTokenType) {
    return payload;
  }
}
