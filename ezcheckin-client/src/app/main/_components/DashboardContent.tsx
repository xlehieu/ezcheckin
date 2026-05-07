import { getMyProfile } from "@/features/users/user.action";
import { AUTH_ROUTES } from "@/routes/auth/auth.route";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const AdminDashboardLayout = dynamic(() => import("./AdminDashboardLayout"));

const ManagerDashboardLayout = dynamic(
  () => import("./ManagerDashboardLayout"),
);
export default async function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const myProfile = await getMyProfile();

  if (!myProfile.data) {
    return redirect(AUTH_ROUTES.LOGIN);
  }

  const user = myProfile.data;

  return (
    <>
      {user.role === "ADMIN" && (
        <AdminDashboardLayout user={user}>{children}</AdminDashboardLayout>
      )}

      {user.role === "MANAGER" && (
        <ManagerDashboardLayout user={user}>{children}</ManagerDashboardLayout>
      )}

      {user.role === "EMPLOYEE" && children}
    </>
  );
}
