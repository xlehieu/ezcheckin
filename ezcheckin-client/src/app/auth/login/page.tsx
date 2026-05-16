import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { AUTH_ROUTES } from "@/routes/auth/auth.route";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata:Metadata={
  title:{
    absolute:"Đăng nhập"
  }
}
const LoginPage=()=> {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md glass-card-hover p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold glow-text">
            ĐĂNG NHẬP
          </h1>
          {/* <p className="text-sm text-muted-foreground mt-2">
            HELLO
          </p> */}
        </div>

        <Suspense fallback={<div></div>}><LoginForm /></Suspense>

        <div className="text-center mt-6 text-sm">
          <span className="text-muted-foreground">Bạn chưa có tài khoản? </span>
          <Link 
            href={AUTH_ROUTES.REGISTER} 
            className="glow-text font-semibold hover:opacity-80 transition-opacity"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
export default LoginPage