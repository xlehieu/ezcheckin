// app/auth/register/page.tsx
import Link from "next/link";

import { AUTH_ROUTES } from "@/routes/auth/auth.route";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md glass-card-hover p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold glow-text">
            ĐĂNG KÝ
          </h1>
        </div>

        <RegisterForm />

        <div className="text-center mt-6 text-sm">
          <span className="text-muted-foreground">Bạn đã có tài khoản? </span>
          <Link 
            href={AUTH_ROUTES.LOGIN} 
            className="glow-text font-semibold hover:opacity-80 transition-opacity"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}