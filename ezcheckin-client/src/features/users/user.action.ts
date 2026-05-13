"use server";

import { OptionsFetch } from "@/@types/common";
import { APIPaginationResponse, APIResponse } from "@/@types/response.type";
import {
  CreateUserPayload,
  MyProfile,
  UpdateUserPayload,
  UserQueryParams,
  UserRecord,
} from "@/@types/user.type";
import { apiServer } from "@/lib/apiServer";
import { revalidateServerAction } from "@/lib/revalidateTagSA";
import { USER_DURATION, USER_TAG } from "./user.tag";

export async function getMyProfile() {
  return apiServer.get<APIResponse<MyProfile>>("/users/my-profile", {
    tags: [USER_TAG.MY_PROFILE],
    revalidate: USER_DURATION.MY_PROFILE,
    passError: true,
  });
}

export async function getUsers(query?: UserQueryParams, options?: OptionsFetch) {
  if (options?.hasRevalidate) {
    revalidateServerAction(USER_TAG.USERS_LIST);
  }
  return await apiServer.get<APIPaginationResponse<UserRecord>>(
    `/users`,
    {
      tags: [USER_TAG.USERS_LIST],
      revalidate: USER_DURATION.USERS_LIST,
      queryParams: query,
    }
  );
}

export async function getUserById(id: string) {
  return apiServer.get<APIResponse<UserRecord>>(`/users/${id}`, {
    tags: [USER_TAG.USER_DETAIL(id)],
    revalidate: USER_DURATION.USER_DETAIL,
    passError: true,
  });
}

export async function createUser(payload: CreateUserPayload) {
  return await apiServer.post<APIResponse<UserRecord>>("/users", payload);
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload
) {
  return await apiServer.patch<APIResponse<UserRecord>>(
    `/users/${id}`,
    payload,
  );
}

export async function deleteUser(id: string) {
  return await apiServer.delete<APIResponse<boolean>>(`/users/${id}`);
}

export async function restoreUser(id: string) {
  return await apiServer.post<APIResponse<boolean>>(
    `/users/${id}/restore`,
  );
}