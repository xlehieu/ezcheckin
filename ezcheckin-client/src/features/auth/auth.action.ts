"use server"
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/@types/auth.type";
import { APIResponse } from "@/@types/response.type";
import { apiServer } from "@/lib/apiServer";

export async function login(loginPayload:LoginPayload){
    return await apiServer.post<APIResponse<LoginResponse>>("/auth/login",loginPayload,{
        passError:true
    })
    // console.log("resLogin",resLogin)
    // if(resLogin.data){
    //     redirect(MAIN_ROUTE.MAIN)
    // }
}

export async function register(regiserPayload:RegisterPayload){
    return await apiServer.post<APIResponse<RegisterResponse>>("/auth/register",regiserPayload)
}