// app/auth/register/RegisterForm.tsx
"use client"

import { useForm } from "@tanstack/react-form"
import * as React from "react"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { register } from "@/features/auth/auth.serverAction"
import { useRouter } from "next/navigation"
import { AUTH_ROUTES } from "@/routes/auth/auth.route"
// import { useRegister } from "@/hooks/tanstack/auth/auth.mutation"

export const registerSchema = z.object({
  email: z.email("Không đúng định dạng email"),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự"),
  confirmPassword: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  // const {mutateAsync:register}=useRegister()
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter()
  const formTanstack = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        const result = await register({
          email: value.email,
          password: value.password,
          confirmPassword:value.confirmPassword
        });
        console.log(result)
        if (result?.data?._id) {
          toast.success("Đăng ký thành công! Vui lòng đăng nhập");
          router.replace(AUTH_ROUTES.LOGIN)
          return;
        }

        toast.error("Đăng ký thất bại");
      } catch (error) {
        toast.error((error as Error).message || "Đăng ký thất bại");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
          e.preventDefault();
        formTanstack.handleSubmit();
      }}
    >
      <FieldGroup className="space-y-4">
        <formTanstack.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30"
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />

        <formTanstack.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30"
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />

        <formTanstack.Field
          name="confirmPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Xác nhận mật khẩu</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30"
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />

        <Button
          variant="glow"
          type="submit"
          disabled={isLoading}
          className="glow-button w-full mt-6"
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </FieldGroup>
    </form>
  );
}