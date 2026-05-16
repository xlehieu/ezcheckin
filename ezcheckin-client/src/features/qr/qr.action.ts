"use server";

import { OptionsFetch } from "@/@types/common";
import { QRGenerate, QRVerifyAttendancePayload, QRVerifyResponse } from "@/@types/qr.type";
import { APIResponse } from "@/@types/response.type";
import { apiServer } from "@/lib/apiServer";
import { revalidateServerAction } from "@/lib/revalidateTagSA";
import { QR_DURATION, QR_TAG } from "./qr.tag";

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

export async function verifyQR(payload:QRVerifyAttendancePayload) {
  const res = await apiServer.post<APIResponse<QRVerifyResponse>>(`/qr/verify/checkin-checkout`, payload);
  return res.data;
}
