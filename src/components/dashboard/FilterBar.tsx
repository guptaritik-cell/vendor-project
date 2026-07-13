"use client";

import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import type { SubmissionStatus } from "@/types/vendor";

const STATUS_FILTERS: { key: SubmissionStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
  onLoadDemo,
}: {
  statusFilter: SubmissionStatus | "all";
  onStatusFilterChange: (status: SubmissionStatus | "all") => void;
  search: string;
  onSearchChange: (v: string) => void;
  onLoadDemo?: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 flex-wrap"
      style={{ background: "#181818", borderBottom: "1px solid rgba(255,77,0,0.12)" }}
    >
      {/* Status filter toggle group */}
      <div className="rounded-lg overflow-hidden border border-[rgba(255,77,0,0.25)] flex">
        {STATUS_FILTERS.map((f) => {
          const isActive = statusFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => onStatusFilterChange(f.key)}
              className="h-8 px-3 text-xs transition-colors"
              style={{
                background: isActive ? "rgba(255,77,0,0.25)" : "transparent",
                color: isActive ? "#FFFFFF" : "#888888",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888]" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Vendor name or ID…"
          className="h-8 pl-8 w-52 text-xs bg-[#222222] border-[rgba(255,77,0,0.25)] text-[#F5F5F5] placeholder:text-[#888888] focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]"
        />
      </div>

      {onLoadDemo && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLoadDemo}
          className="ml-auto flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
          style={{
            background: "rgba(255,77,0,0.12)",
            border: "1px solid rgba(255,77,0,0.35)",
            color: "#FF7A35",
          }}
        >
          <Sparkles size={12} /> Load demo scenarios
        </motion.button>
      )}
    </div>
  );
}
