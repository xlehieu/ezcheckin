import { AUTH_ROUTES } from "@/routes/auth/auth.route";
import { usersService } from "@/features/users/user.serviceServer";
import { redirect } from "next/navigation";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const myProfile = await usersService.myProfile();
  if (!myProfile.data) {
    return redirect(AUTH_ROUTES.LOGIN);
  }
  console.log("myProfilemyProfilemyProfilemyProfile",myProfile)

  return <>{children}</>;
}