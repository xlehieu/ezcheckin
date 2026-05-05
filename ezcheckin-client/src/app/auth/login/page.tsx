import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="w-full max-w-md glass-card-hover p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold glow-text">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Welcome back! Login with your credentials
          </p>
        </div>

        <LoginForm />

        <div className="text-center mt-6 text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a 
            href="/signup" 
            className="glow-text font-semibold hover:opacity-80 transition-opacity"
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}