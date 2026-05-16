"use client";

import { OptionsFetch } from "@/@types/common";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAttendanceBusinessStore } from "./attendance.store";
import { attendanceBusinessLogs } from "./attendances.action";

export function useAttendanceBusinessLogs(notify?: {
  success: (msg: string) => void;
  error: (msg: string) => void;
}) {
  const { attendanceBusinessLogsFilter, setAttendanceBusinessLogsFilter } = useAttendanceBusinessStore(
    useShallow((state) => ({
      attendanceBusinessLogsFilter: state.attendanceBusinessLogsFilter,
      setAttendanceBusinessLogsFilter: state.setAttendanceBusinessLogsFilter,
    }))
  );

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBusinessLogs = useCallback(
    async (options?: OptionsFetch) => {
      try {
        setLoading(true);

        const res = await attendanceBusinessLogs(
          attendanceBusinessLogsFilter,
          options
        );
        console.log("resresresres",res)
        setData(res.data);
      } catch (err) {
        notify?.error("Lỗi khi tải business logs");
      } finally {
        setLoading(false);
      }
    },
    [attendanceBusinessLogsFilter, notify]
  );

  useEffect(() => {
    fetchBusinessLogs();
  }, [attendanceBusinessLogsFilter, fetchBusinessLogs]);

  const reload = useCallback(() => {
    return fetchBusinessLogs({ hasRevalidate: true });
  }, [fetchBusinessLogs]);


  return {
    data,
    loading,

    attendanceBusinessLogsFilter,
    setAttendanceBusinessLogsFilter,

    fetchBusinessLogs,
    reload,
  };
}