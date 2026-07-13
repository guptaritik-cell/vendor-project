"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

const PATH_TITLES: Record<string, string> = {
  "/dashboard": "Vendor Submissions",
};

export function TopBar() {
  const pathname = usePathname();
  const title = PATH_TITLES[pathname] ?? "Dashboard";

  return (
    <header
      className="flex-shrink-0 h-16 flex items-center justify-between px-6 gap-4"
      style={{
        background: "#0D0D0D",
        borderBottom: "1px solid rgba(255,77,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <h1 className="text-[15px] font-semibold text-[#F5F5F5] whitespace-nowrap">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/onboard"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
        >
          <Plus size={13} /> New Submission
        </Link>
      </div>
    </header>
  );
}
