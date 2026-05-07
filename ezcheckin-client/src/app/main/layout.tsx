// import { useMyProfile } from "@/hooks/tanstack/users/users.query";

import { Suspense } from "react";
import AuthGuard from "./_components/AuthGuard";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
