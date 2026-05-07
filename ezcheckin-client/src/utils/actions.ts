'use server'
import {signIn} from "@/auth";
import { InvalidEmailPasswordError } from "./error";
import { toast } from "sonner";

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            email: email,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error:any) {
        console.log(JSON.stringify(error))
        if(error.name ===InvalidEmailPasswordError.name){
            return {error:error.message}
        }
        return {"error": "Incorrect username or password"}
        // if (error.cause.err instanceof InvalidLoginError) {
        // } else {
        //     throw new Error("Failed to authenticate")
        // }
    }
}