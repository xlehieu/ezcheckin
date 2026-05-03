export class GetAttendanceFilterDto {
  shiftId?: string;
  userId?: string;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
}