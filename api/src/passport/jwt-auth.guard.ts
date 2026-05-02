import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
type InfoJWT = {
  name: 'TokenExpiredError' | string;
  message: string;
  expiredAt: string;
};
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info: InfoJWT) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        type: 'TOKEN_EXPIRED',
        message: 'Access token đã hết hạn',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }
    if (err || !user) {
      // You can throw an exception based on either "info" or "err" arguments
      throw err || new UnauthorizedException('Access token is invalid');
    }
    return user;
  }
}
