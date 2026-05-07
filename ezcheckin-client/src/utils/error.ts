/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type = "CustomAuthError";
  constructor(message?: string) {
    super(message);
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type = "InvalidEmailPassword";
  constructor(message: string = "Email hoặc mật khẩu sai") {
    super(message);
    this.message = message;
  }
}