import {
  AttendanceLogsQueryParam,
  AttendanceStatsQueryParam,
} from "@/@types/attendance.type";
import dayjs from "dayjs";
import { create } from "zustand";

type AttendanceStore = {
  attendanceBusinessLogsFilter: AttendanceLogsQueryParam;
  setAttendanceBusinessLogsFilter: (
    values: Partial<AttendanceLogsQueryParam>,
  ) => void;
  attendanceBusinessStatsFilter: AttendanceStatsQueryParam;
  setAttendanceBusinessStatsFilter: (
    values: Partial<AttendanceStatsQueryParam>,
  ) => void;
};

export const useAttendanceBusinessStore = create<AttendanceStore>((set) => ({
  attendanceBusinessLogsFilter: {
    fromDate: dayjs().format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
  },
  setAttendanceBusinessLogsFilter: (values) =>
    set((state) => ({
      attendanceBusinessLogsFilter: {
        ...state.attendanceBusinessLogsFilter,
        ...values,
      },
    })),
  attendanceBusinessStatsFilter: {
    date: dayjs().format("YYYY-MM-DD"),
  },
  setAttendanceBusinessStatsFilter: (values) =>
    set((state) => ({
      attendanceBusinessLogsFilter: {
        ...state.attendanceBusinessLogsFilter,
        ...values,
      },
    })),
}));
