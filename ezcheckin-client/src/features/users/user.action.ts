"use server";

import { APIPaginationResponse, APIResponse } from "@/@types/response.type";
import {
  
  MyProfile,
  UserQueryParams,
  UserRecord
} from "@/@types/user.type";
import { apiServer } from "@/lib/apiServer";
import { USER_DURATION, USER_TAG } from "./user.tag";

export async function getMyProfile() {
  return apiServer.get<APIResponse<MyProfile>>("/users/my-profile", {
    tags: [USER_TAG.MY_PROFILE],
    revalidate: USER_DURATION.MY_PROFILE,
    passError: true,
  });
}

export async function getUsers(query?: UserQueryParams) {
  return await apiServer.get<APIPaginationResponse<UserRecord>>(
    `/users`,
    {
      revalidate: USER_DURATION.USERS_LIST,
      queryParams: query,
    }
  );
}

// export async function getUserById(id: string) {
//   return apiServer.get<APIResponse<User>>(`/users/${id}`, {
//     tags: [USER_TAG.USER_DETAIL(id)],
//     revalidate: USER_DURATION.USER_DETAIL,
//     passError: true,
//   });
// }

// export async function createUser(payload: CreateUserPayload) {
//   return apiServer.post<APIResponse<User>>("/users", payload, {
//     tagRevalidateAfterAction: USER_TAG.USERS,
//   });
// }

// export async function updateUser(
//   id: string,
//   payload: UpdateUserPayload
// ) {
//   return apiServer.patch<APIResponse<User>>(
//     `/users/${id}`,
//     payload,
//     {
//       tagRevalidateAfterAction: USER_TAG.USERS,
//     }
//   );
// }

// export async function deleteUser(id: string) {
//   return apiServer.delete<APIResponse<boolean>>(`/users/${id}`, {
//     tagRevalidateAfterAction: USER_TAG.USERS,
//   });
// }

// export async function restoreUser(id: string) {
//   return apiServer.post<APIResponse<boolean>>(
//     `/users/${id}/restore`,
//     {},
//     {
//       tagRevalidateAfterAction: USER_TAG.USERS,
//     }
//   );
// }