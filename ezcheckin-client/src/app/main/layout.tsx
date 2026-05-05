import { AUTH_ROUTES } from "@/routes/auth/auth.route";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ({
  children,
}: {
  children: React.ReactNode;
})  {
  const cookieStore = await cookies();
  const token = cookieStore.get("acces_token");

  if (!token) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  // gọi backend verify
  const res = await fetch("http://localhost:3000/auth/me", {
    headers: {
      Cookie: `accessToken=${token.value}`,
    },
  });

  if (!res.ok) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  return {children};
}