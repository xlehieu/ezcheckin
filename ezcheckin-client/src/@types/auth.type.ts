export type LoginPayload = {
  email: string;
  password: string;
};
export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type LoginResponse = boolean;
export type RegisterResponse = {
  _id:string;
  email: string;
};
