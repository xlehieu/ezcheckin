"use server"
import { LoginPayload, LoginResponse } from "@/@types/auth.type";
import { APIResponse } from "@/@types/response.type";
import { apiServer } from "@/lib/apiServer";
import { MAIN_ROUTE } from "@/routes/main/main.route";
import { redirect } from "next/navigation";

export async function login(loginPayload:LoginPayload){
    return await apiServer.post<APIResponse<LoginResponse>>("/auth/login",loginPayload)
    // console.log("resLogin",resLogin)
    // if(resLogin.data){
    //     redirect(MAIN_ROUTE.MAIN)
    // }
}