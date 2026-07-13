"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown, Inbox, Sparkles } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { SubmissionStatus, VendorSubmission } from "@/types/vendor";

const HEADER_BG = "#222222";
const ODD_BG = "#1C1C1C";
const EVEN_BG = "#181818";
const HOVER_EVEN = "#261508";
const HOVER_ODD = "#281808";

export interface SubmissionRow {
  submission: VendorSubmission;
  status: SubmissionStatus;
}

type SortKey = "name" | "country" | "spend" | "status" | "createdAt";

function SortIcon({ col, sortConfig }: { col: SortKey; sortConfig: { key: SortKey; dir: "asc" | "desc" } | null }) {
  if (!sortConfig || sortConfig.key !== col) return <ChevronsUpDown size={11} className="opacity-30" />;
  return sortConfig.dir === "asc" ? (
    <ChevronUp size={11} className="text-[#FF4D00]" />
  ) : (
    <ChevronDown size={11} className="text-[#FF4D00]" />
  );
}

const thStyle: React.CSSProperties = {
  background: HEADER_BG,
  color: "#888888",
  fontSize: 11,
  fontWeight: 500,
  padding: "8px 12px",
  whiteSpace: "nowrap",
  borderBottom: "1px solid rgba(255,77,0,0.18)",
  userSelect: "none",
};

export function SubmissionsTable({
  rows,
  onRowClick,
  onLoadDemo,
}: {
  rows: SubmissionRow[];
  onRowClick: (submission: VendorSubmission) => void;
  onLoadDemo?: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  const sorted = useMemo(() => {
    if (!sortConfig) return rows;
    const { key, dir } = sortConfig;
    const value = (r: SubmissionRow): string | number => {
      switch (key) {
        case "name":
          return r.submission.company.legalName.toLowerCase();
        case "country":
          return r.submission.company.country.toLowerCase();
        case "spend":
          return Number(r.submission.commercial.estimatedAnnualSpend) || 0;
        case "status":
          return r.status;
        case "createdAt":
          return r.submission.createdAt;
      }
    };
    return [...rows].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  function toggleSort(key: SortKey) {
    setSortConfig((cur) => (cur?.key === key ? { key, dir: cur.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  const columns: { key: SortKey; label: string; width: number }[] = [
    { key: "name", label: "Vendor", width: 260 },
    { key: "country", label: "Country", width: 140 },
    { key: "spend", label: "Est. Annual Spend", width: 160 },
    { key: "status", label: "Status", width: 120 },
    { key: "createdAt", label: "Submitted", width: 140 },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,77,0,0.18)" }}>
      <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ ...thStyle, width: col.width, cursor: "pointer" }}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label} <SortIcon col={col.key} sortConfig={sortConfig} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,77,0,0.08)" }}
                    >
                      <Inbox size={20} className="text-[#888888]" />
                    </div>
                    <p className="text-[#888888] text-sm">No submissions found</p>
                    {onLoadDemo && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onLoadDemo}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold mt-1"
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
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => {
                const { submission, status } = row;
                const isHovered = hoveredId === submission.id;
                const isEven = idx % 2 === 0;
                const rowBg = isHovered ? (isEven ? HOVER_EVEN : HOVER_ODD) : isEven ? EVEN_BG : ODD_BG;
                const tdBase: React.CSSProperties = {
                  padding: "10px 12px",
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  color: "#D4D4D4",
                  background: rowBg,
                  transition: "background 0.1s",
                };
                const spend = Number(submission.commercial.estimatedAnnualSpend) || 0;

                return (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.6), ease: [0.4, 0, 0.2, 1] }}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredId(submission.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onRowClick(submission)}
                  >
                    <td style={tdBase}>
                      <div className="flex flex-col">
                        <span style={{ color: "#F5F5F5", fontWeight: 500 }}>
                          {submission.company.legalName || "—"}
                        </span>
                        {submission.company.tradingName && (
                          <span style={{ color: "#888888", fontSize: 11 }}>
                            {submission.company.tradingName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={tdBase}>{submission.company.country || "—"}</td>
                    <td style={tdBase}>
                      {spend > 0 ? `$${spend.toLocaleString()}` : "—"}
                    </td>
                    <td style={tdBase}>
                      <StatusBadge status={status} />
                    </td>
                    <td style={{ ...tdBase, color: "#888888" }}>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
