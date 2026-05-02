// permissions.guard.ts
import { PERMISSIONS_KEY } from '@/decorator/permissions.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 🔥 Lấy permission từ decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 👉 Không có permission → cho qua
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ❌ chưa login
    if (!user) {
      throw new ForbiddenException('Chưa xác thực');
    }

    const userPermissions: string[] = user.permissions || [];

    // Check permission
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    return true;
  }
}
