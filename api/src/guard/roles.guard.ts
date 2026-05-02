// roles.guard.ts
import { ROLES_KEY } from '@/decorator/roles.decorator';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách roles yêu cầu từ Metadata của class hoặc handler
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Nếu route không yêu cầu role nào, cho qua
    }

    // 2. Lấy user từ request (giả định AuthGuard đã gán user từ token vào đây)
    const { user } = context.switchToHttp().getRequest();
    this.logger.verbose(user);
    // 3. Kiểm tra xem user.role có nằm trong danh sách requiredRoles không
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
