import { ListQueryParams } from "./common";

export type ShiftStatus = "ACTIVE" | "INACTIVE";

export type ShiftRecord = {
  _id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  business: string;
  deletedAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ShiftQueryParams = ListQueryParams & {
  status?: boolean;
};

export type CreateShiftPayload = {
  shiftName: string;
  startTime: string;
  endTime: string;
};

export type UpdateShiftPayload = Partial<CreateShiftPayload>;
