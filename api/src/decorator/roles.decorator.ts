// roles.decorator.ts
import { RoleName } from '@/modules/users/schema/users.schema';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
