// app/(dashboard)/layout.tsx

import { getMyProfile } from "@/features/users/user.action";
import { AUTH_ROUTES } from "@/routes/auth/auth.route";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { DashboardSkeleton } from "./_components/DashboardSkeleton";
import DashboardContent from "./_components/DashboardContent";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent>
        {children}
      </DashboardContent>
    </Suspense>
  );
}
