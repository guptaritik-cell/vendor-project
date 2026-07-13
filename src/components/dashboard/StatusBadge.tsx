"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { SubmissionStatus } from "@/types/vendor";
import type { RuleOutcome } from "@/lib/rulesEngine";

const STATUS_STYLES: Record<SubmissionStatus, { bg: string; color: string; label: string; glow: string }> = {
  approved: { bg: "rgba(34,197,94,0.14)", color: "#4ade80", label: "Approved", glow: "rgba(34,197,94,0.55)" },
  pending: { bg: "rgba(255,166,0,0.14)", color: "#FFA500", label: "Pending", glow: "rgba(255,166,0,0.55)" },
  rejected: { bg: "rgba(239,68,68,0.14)", color: "#f87171", label: "Rejected", glow: "rgba(239,68,68,0.55)" },
};

export function StatusBadge({ status, size = "sm" }: { status: SubmissionStatus; size?: "sm" | "lg" }) {
  const s = STATUS_STYLES[status];
  if (size === "lg") {
    return (
      <motion.span
        animate={{
          boxShadow: [`0 0 0px ${s.glow}`, `0 0 22px ${s.glow}`, `0 0 0px ${s.glow}`],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide"
        style={{ background: s.bg, color: s.color }}
      >
        {s.label}
      </motion.span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

const RULE_ICON_STYLES: Record<RuleOutcome, { Icon: typeof CheckCircle2; color: string }> = {
  passed: { Icon: CheckCircle2, color: "#4ade80" },
  warning: { Icon: AlertTriangle, color: "#FFA500" },
  failed: { Icon: XCircle, color: "#f87171" },
};

export function RuleOutcomeIcon({ outcome, size = 16 }: { outcome: RuleOutcome; size?: number }) {
  const { Icon, color } = RULE_ICON_STYLES[outcome];
  return <Icon size={size} style={{ color }} className="flex-shrink-0" />;
}
