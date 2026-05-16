export type AttendanceLogsQueryParam = {
  shiftId?: string;
  userId?: string;
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
};

export type AttendanceStatsQueryParam={
  date:string
}