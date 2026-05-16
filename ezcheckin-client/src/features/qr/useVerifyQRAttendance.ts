// features/qr/hooks/useVerifyQR.ts
"use client";

import { QRVerifyAttendancePayload } from "@/@types/qr.type";
import { verifyQR } from "@/features/qr/qr.action";
import { useState } from "react";

export type VerifyStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export function useVerifyQRAttendance() {
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState("");

  const verify = async (data:QRVerifyAttendancePayload) => {
    try {
      setStatus("loading");

      const response = await verifyQR(data);
      console.log("response",response)
      if (response.data) {
        setStatus("success");
        setMessage(response.type==="CHECKIN" ? "Check-in thành công!":"Check-out thành công!");
      } else {
        setStatus("error");
        setMessage("Mã QR không hợp lệ");
      }
    } catch (error:any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
  };

  return {
    status,
    message,
    verify,
    reset,
  };
}