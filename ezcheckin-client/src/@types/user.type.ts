import { ListQueryParams } from "./common";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type Business = {
  _id: string;
  admin: string;
  isActive: boolean;
  location: number[];
  earlyCheckinMinutes: number;
  lateCheckoutMinutes: number;
  graceCheckinMinutes: number;
  graceCheckoutMinutes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MyProfile = {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  business: Business;
  isActive: boolean;
  employeeCode?: string;
  deletedAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserQueryParams = ListQueryParams & {
  role?: UserRole;
};

export type UserRecord = {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  business: string;
  isActive: boolean;
  employeeCode?: string;
  deletedAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CreateUserPayload = {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  employeeCode:string
};

export type UpdateUserPayload = Partial<CreateUserPayload> & {
  isActive?: boolean;
  employeeCode?: string;
};
