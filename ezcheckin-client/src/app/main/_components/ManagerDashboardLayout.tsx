
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  LogOut,
} from "lucide-react";

import { MyProfile } from "@/@types/user.type";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck2,
  },
];

function ManagerDashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: MyProfile;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-background lg:block">
          <div className="flex h-screen flex-col">
            <div className="border-b px-6 py-5">
              <h1 className="text-2xl font-bold tracking-tight">
                Manager Panel
              </h1>
            </div>

            <div className="flex-1 space-y-1 p-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-muted"
                  >
                    <Icon className="size-5" />
                    {item.title}
                  </Link>
                );
              })}
            </div>

            <div className="border-t p-4">
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-sm font-semibold">{user.email}</p>
                <p className="text-xs text-muted-foreground">Manager</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center justify-end gap-3 px-4 py-4 lg:px-8">
              <button className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted">
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </header>

          <section className="p-4 lg:p-8">{children}</section>
        </main>
      </div>
    </div>
  );
}
export default ManagerDashboardLayout