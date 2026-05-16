"use server";

import { AttendanceLogsQueryParam, AttendanceStatsQueryParam } from "@/@types/attendance.type";
import { OptionsFetch } from "@/@types/common";
import { APIResponse } from "@/@types/response.type";
import { apiServer } from "@/lib/apiServer";
import { revalidateServerAction } from "@/lib/revalidateTagSA";
import { ATTENDANCES_DURATION, ATTENDANCES_TAG } from "./attendance.tag";


export async function attendanceBusinessLogs(queryParams:AttendanceLogsQueryParam,options?:OptionsFetch) {
  if(options?.hasRevalidate){
    revalidateServerAction(ATTENDANCES_TAG.LOGS)
  }
  const res= await apiServer.get<APIResponse<any>>(`/attendances/business-logs`, {
    tags: [ATTENDANCES_TAG.LOGS],
    revalidate: ATTENDANCES_DURATION.LOGS,
    queryParams
  });
  return res.data
}

export async function attendanceBusinessStats(queryParams:AttendanceStatsQueryParam, options?:OptionsFetch) {
  if(options?.hasRevalidate){
    revalidateServerAction(ATTENDANCES_TAG.STATS)
  }
  const res= await apiServer.get<APIResponse<any>>(`/attendances/business-stats`, {
    tags: [ATTENDANCES_TAG.STATS],
    revalidate: ATTENDANCES_DURATION.STATS,
    queryParams
  });
  return res.data
}

