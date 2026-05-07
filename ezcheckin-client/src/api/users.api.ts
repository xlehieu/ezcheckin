import { APIResponse } from "@/@types/response.type"
import apiClient from "@/lib/ky.lib"

export const getMyProfileAPI = ()=>{
    return apiClient.get<APIResponse<{}>>("/users/my-profile")
}