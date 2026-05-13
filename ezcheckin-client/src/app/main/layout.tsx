import { Suspense } from "react";

import { DashboardSkeleton } from "../../components/skeleton/DashboardSkeleton";
import DashboardContent from "./_components/DashboardContent";
import { Metadata } from "next";

export const metadata:Metadata={
  title:{
    absolute:"Dashboard",
    template:"%s | Dashboard"
  }
}
export default function DashboardLayout({
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
