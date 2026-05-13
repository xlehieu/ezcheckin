"use server";

import { OptionsFetch } from "@/@types/common";
import { APIPaginationResponse, APIResponse } from "@/@types/response.type";
import {
  ShiftRecord
} from "@/@types/shift.type";
import { apiServer } from "@/lib/apiServer";
import { revalidateServerAction } from "@/lib/revalidateTagSA";
import { QR_DURATION, QR_TAG } from "./qr.tag";
import { QRGenerate, QRVerifyResponse } from "@/@types/qr.type";

export async function generateQR(shiftId:string,options?:OptionsFetch) {
  if(options?.hasRevalidate){
    revalidateServerAction(QR_TAG.QR_GENERATE)
  }
  const res= await apiServer.get<APIResponse<QRGenerate>>(`/qr/generate`, {
    tags: [QR_TAG.QR_GENERATE],
    revalidate: QR_DURATION.QR_GENERATE,
    queryParams: {shiftId},
  });
  return res.data.token
}

export async function verifyQR(token: string) {
  const res = await apiServer.post<APIResponse<QRVerifyResponse>>(`/qr/verify`, {
    token,
  });
  return res.data;
}
