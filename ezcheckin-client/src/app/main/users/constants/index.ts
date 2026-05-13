import { UserRole } from "@/@types/user.type";

export const roleOptions : {label:string,value:UserRole}[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Employee", value: "EMPLOYEE" },
];