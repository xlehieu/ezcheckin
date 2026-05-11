"use client"

import { useForm } from "@tanstack/react-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/features/auth/auth.action"
import { ROUTE_MAIN } from "@/routes/main/main.route"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const formSchema = z.object({
  email: z.email("Không đúng định dạng email"),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự"),
});

export function LoginForm() {
  const router= useRouter()
  // const {mutateAsync:login}=useLogin()
  const formTanstack = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // await login(value)

      const data = await login(value)
      if(data.data){
        toast.success("Đăng nhập thành công")
        router.replace(ROUTE_MAIN.MAIN)
      }
      // await signIn("credentials",{
      //   ...value,
      //   redirect:false
      // })
      // const resLogin = await authenticate(value.email,value.password )
      // console.log(resLogin)
      // if(resLogin.error){
      //   toast.error(resLogin.error)
      // }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        formTanstack.handleSubmit()
      }}
    >
      <FieldGroup className="space-y-4">
        <formTanstack.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
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
                  <FieldError errors={field.state.meta.errors}/>
                )}
              </Field>
            )
          }}
        />

        <formTanstack.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="border-primary/20 focus:border-primary/50 focus:ring-primary/30"
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )
          }}
        />

        <Button 
        variant={"glow"}
          type="submit" 
          className="glow-button w-full mt-6"
        >
          Sign in
        </Button>
      </FieldGroup>
    </form>
  )
}