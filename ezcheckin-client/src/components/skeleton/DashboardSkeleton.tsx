import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 lg:block">
        <div className="space-y-6 p-4">
          {/* Logo */}
          <Skeleton className="h-10 w-36 rounded-xl" />

          {/* Menu */}
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-full rounded-xl"
              />
            ))}
          </div>

          {/* User */}
          <div className="pt-6">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Header */}
        <header>
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40 rounded-lg" />
              <Skeleton className="h-4 w-56 rounded-lg" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="hidden h-10 w-28 rounded-xl sm:block" />
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="space-y-6 p-4 lg:p-6">
          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-muted/40 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>

                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-muted/30">
            {/* Table Header */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-7 w-40 rounded-lg" />

              <div className="flex gap-3">
                <Skeleton className="h-10 w-full sm:w-60 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>

            {/* Table rows */}
            <div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[60%] rounded-lg" />
                    <Skeleton className="h-3 w-[40%] rounded-lg" />
                  </div>

                  <Skeleton className="hidden h-4 w-24 rounded-lg md:block" />

                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}