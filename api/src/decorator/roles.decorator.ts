// roles.decorator.ts
import { RoleName } from '@/modules/users/schema/role.schema';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
