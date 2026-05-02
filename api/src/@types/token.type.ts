import { UserLogin } from '@/modules/auth/dto/auth.dto';
export type AccessTokenType = UserLogin & {
  iat: number;
  exp: number;
};
