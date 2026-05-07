import { LoginPayload, LoginResponse, RegisterPayload } from "@/@types/auth.type";
import { APIResponse } from "@/@types/response.type";
import apiClient from "@/lib/ky.lib";

export const loginAPI = (loginPayload:LoginPayload)=>{
    return apiClient.post<LoginResponse>("/auth/login",loginPayload)
}
export const registerAPI = (registerPayload:RegisterPayload)=>{
    return apiClient.post("/auth/register",registerPayload)
}
