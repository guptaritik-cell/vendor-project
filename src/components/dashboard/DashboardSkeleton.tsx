"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="px-6 pt-6 pb-4 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: "#181818", border: "1px solid rgba(255,77,0,0.15)", height: 92 }}
          >
            <Skeleton className="w-10 h-10 rounded-full bg-[#242424] flex-shrink-0" />
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <Skeleton className="h-6 w-12 bg-[#242424]" />
              <Skeleton className="h-3 w-20 bg-[#242424]" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: "#181818", border: "1px solid rgba(255,77,0,0.2)" }}>
        <Skeleton className="h-4 w-40 bg-[#242424] mb-2" />
        <Skeleton className="h-3 w-56 bg-[#242424] mb-4" />
        <Skeleton className="h-[140px] w-full bg-[#242424]" />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,77,0,0.18)" }}>
        <div style={{ background: "#222222" }} className="h-9" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-3 py-3"
            style={{ background: i % 2 === 0 ? "#181818" : "#1C1C1C", borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <Skeleton className="h-3 w-40 bg-[#242424]" />
            <Skeleton className="h-3 w-24 bg-[#242424]" />
            <Skeleton className="h-3 w-20 bg-[#242424]" />
            <Skeleton className="h-4 w-16 rounded-full bg-[#242424]" />
            <Skeleton className="h-3 w-16 bg-[#242424]" />
          </div>
        ))}
      </div>
    </div>
  );
}
