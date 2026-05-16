"use server";

import { OptionsFetch } from "@/@types/common";
import { APIPaginationResponse, APIResponse } from "@/@types/response.type";
import {
  CreateShiftPayload,
  ShiftQueryParams,
  ShiftRecord,
  UpdateShiftPayload,
} from "@/@types/shift.type";
import { apiServer } from "@/lib/apiServer";
import { revalidateServerAction } from "@/lib/revalidateTagSA";
import { SHIFT_DURATION, SHIFT_TAG } from "./shift.tag";


export async function getShifts(query?: ShiftQueryParams,options?:OptionsFetch) {
  if(options?.hasRevalidate){
    revalidateServerAction(SHIFT_TAG.SHIFTS_LIST)
  }
  return await apiServer.get<APIPaginationResponse<ShiftRecord>>(`/shifts`, {
    tags: [SHIFT_TAG.SHIFTS_LIST],
    revalidate: SHIFT_DURATION.SHIFTS_LIST,
    queryParams: query,
  });
}

export async function getShiftById(id: string) {
  return await apiServer.get<APIResponse<ShiftRecord>>(`/shifts/${id}`, {
    tags: [SHIFT_TAG.SHIFT_DETAIL(id)],
    revalidate: SHIFT_DURATION.SHIFT_DETAIL,
    passError: true,
  });
}

export async function createShift(payload: CreateShiftPayload) {
  return await apiServer.post<APIResponse<ShiftRecord>>("/shifts", payload);
}

export async function updateShift(id: string, payload: UpdateShiftPayload) {
  return await apiServer.patch<APIResponse<ShiftRecord>>(
    `/shifts/${id}`,
    payload,
  );
}

export async function deleteShift(id: string) {
  return await apiServer.delete<APIResponse<boolean>>(`/shifts/${id}`,{});
}

export async function restoreShift(id: string) {
  return await apiServer.post<APIResponse<boolean>>(
    `/shifts/${id}/restore`,
  );
}

export async function toggleShiftStatus(id: string) {
  return await apiServer.patch<APIResponse<ShiftRecord>>(
    `/shifts/toggle/${id}`,
  );
}
