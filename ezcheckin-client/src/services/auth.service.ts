import { LoginPayload } from '@/@types/auth.type';
import { APIResponse } from '@/@types/response.type';
import api from '@/lib/ky';

export const authService = {
  login: async (json: LoginPayload) => {
    return await api.post<APIResponse<boolean>>('auth/login', { json })
  },
};