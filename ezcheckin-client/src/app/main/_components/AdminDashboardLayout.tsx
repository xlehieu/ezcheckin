// app/(dashboard)/_components/layouts/AdminDashboardLayout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MyProfile } from "@/@types/user.type";
import { IMAGES_COMMON } from "@/assets/images/common";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const  AdminDashboardLayout=({
  children,
  user,
}: {
  children: React.ReactNode;
  user: MyProfile;
}) =>{
  console.log(user)
  const pathname = usePathname();

  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* overlay mobile */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-72 bg-background transition-transform duration-300 lg:translate-x-0",
            openSidebar ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            {/* logo */}
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <img src={IMAGES_COMMON.LOGO} width={150} alt="Logo" className="object-contain"/>

                <p className="text-sm text-muted-foreground">
                  Admin Dashboard
                </p>
              </div>

              <button
                onClick={() => setOpenSidebar(false)}
                className="lg:hidden"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* menu */}
            <div className="flex-1 space-y-1 px-3 py-4">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main
              </p>

              {sidebarItems.map((item) => {
                const Icon = item.icon;

                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="size-5" />

                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* profile */}
            <div className="p-4">
              <div className="rounded-3xl bg-muted p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.email}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Administrator
                    </p>
                  </div>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-background px-4 py-3 text-sm font-medium transition hover:bg-background/80">
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 lg:ml-72">
          {/* HEADER */}
          <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              {/* left */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenSidebar(true)}
                  className="flex size-10 items-center justify-center rounded-xl border bg-background lg:hidden"
                >
                  <Menu className="size-5" />
                </button>

                <div>
                  <h2 className="text-lg font-bold lg:text-2xl">
                    Dashboard
                  </h2>

                  <p className="hidden text-sm text-muted-foreground sm:block">
                    Welcome back 👋
                  </p>
                </div>
              </div>

              {/* right */}
              <div className="flex items-center gap-3">
                <button className="relative flex size-11 items-center justify-center rounded-2xl bg-background transition hover:bg-muted">
                  <Bell className="size-5" />

                  <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
                </button>

                <div className="hidden items-center gap-3 rounded-2xl bg-background px-3 py-2 sm:flex">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="max-w-[140px] truncate text-sm font-semibold">
                      {user.email}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      ADMIN
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE */}
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboardLayout