"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, XCircle, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge, RuleOutcomeIcon } from "./StatusBadge";
import { SubmissionDetails } from "./SubmissionDetails";
import { evaluateVendorSubmission, getFailingFields } from "@/lib/rulesEngine";
import { useVendorStore } from "@/lib/store";
import type { VendorSubmission } from "@/types/vendor";

function Divider() {
  return <div className="h-px" style={{ background: "rgba(255,77,0,0.15)" }} />;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function SubmissionDrawer({
  submission,
  onClose,
  onCommunicate,
}: {
  submission: VendorSubmission | null;
  onClose: () => void;
  onCommunicate: (submission: VendorSubmission) => void;
}) {
  const setManualStatus = useVendorStore((s) => s.setManualStatus);
  const [view, setView] = useState<"audit" | "details">("audit");

  const result = useMemo(() => (submission ? evaluateVendorSubmission(submission) : null), [submission]);
  const failingFields = useMemo(() => (result ? getFailingFields(result) : new Set<string>()), [result]);
  const effectiveStatus = submission?.manualStatus ?? result?.status ?? "pending";
  const isOverridden = !!submission?.manualStatus;

  function handleManualStatus(status: "approved" | "rejected" | null) {
    if (!submission) return;
    setManualStatus(submission.id, status);
    if (status === "approved") toast.success("Submission manually approved");
    else if (status === "rejected") toast.success("Submission manually rejected");
    else toast.success("Reverted to the automatic decision");
  }

  return (
    <Sheet
      open={!!submission}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setView("audit");
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-[480px] border-l border-[rgba(255,77,0,0.2)] p-0 overflow-y-auto"
        style={{ background: "#181818" }}
      >
        {submission && result && (
          <>
            {/* Header */}
            <SheetHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
                >
                  {getInitials(submission.company.legalName || "V")}
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-base font-semibold text-[#F5F5F5] leading-tight">
                    {submission.company.legalName || "Unnamed vendor"}
                  </SheetTitle>
                  <p className="text-xs text-[#888888] mt-0.5">
                    <span className="font-mono">{submission.id}</span> &middot;{" "}
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </SheetHeader>

            <Divider />

            <div className="px-6 py-5 space-y-6">
              {/* Overall status */}
              <div className="flex flex-col items-center gap-2 py-2">
                <p className="text-xs text-[#888888] uppercase tracking-wide">Decision</p>
                <StatusBadge status={effectiveStatus} size="lg" />
                {isOverridden && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[#888888]">
                      Manually set by your team
                      {submission.manualStatusAt && ` on ${new Date(submission.manualStatusAt).toLocaleDateString()}`}
                    </span>
                    <button
                      onClick={() => handleManualStatus(null)}
                      className="flex items-center gap-1 text-[11px] font-medium text-[#FF7A35] hover:text-[#FF9A5F]"
                    >
                      <Undo2 size={11} /> Revert to automatic
                    </button>
                  </div>
                )}
              </div>

              <Divider />

              {/* Tab toggle: rule audit trail vs. raw submitted answers */}
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: "#1E1E1E" }}>
                {(
                  [
                    ["audit", "Rule Audit Trail"],
                    ["details", "Submitted Details"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className="flex-1 h-8 rounded-md text-xs font-medium transition-colors"
                    style={
                      view === key
                        ? { background: "linear-gradient(135deg, #FF4D00, #FF7A35)", color: "#fff" }
                        : { color: "#888888" }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>

              {view === "audit" ? (
                <>
                  {/* Rule audit trail */}
                  <div>
                    <div className="space-y-2">
                      {result.results.map((rule) => (
                        <motion.div
                          key={rule.ruleName}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                          style={{ background: "#1E1E1E", border: "1px solid rgba(255,77,0,0.1)" }}
                        >
                          <RuleOutcomeIcon outcome={rule.status} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-[#F5F5F5]">{rule.ruleName}</p>
                            <p className="text-xs text-[#AAAAAA] mt-0.5 leading-relaxed">{rule.reason}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* What's needed */}
                  {result.whatIsNeeded.length > 0 && (
                    <>
                      <Divider />
                      <div>
                        <p className="text-xs font-medium text-[#FF7A35] mb-3 uppercase tracking-wide">
                          What&apos;s Needed
                        </p>
                        <ul className="space-y-1.5">
                          {result.whatIsNeeded.map((item, i) => (
                            <li key={i} className="text-[13px] text-[#D4D4D4] flex items-start gap-2">
                              <span className="text-[#FF7A35] mt-0.5">&bull;</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <SubmissionDetails submission={submission} failingFields={failingFields} />
              )}

              <Divider />

              {/* Manual review override */}
              <div>
                <p className="text-xs font-medium text-[#888888] mb-3 uppercase tracking-wide">Manual Review</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={effectiveStatus === "approved"}
                    onClick={() => handleManualStatus("approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold disabled:opacity-40"
                    style={{
                      background: "rgba(34,197,94,0.14)",
                      color: "#4ade80",
                      border: "1px solid rgba(34,197,94,0.35)",
                    }}
                  >
                    <CheckCircle2 size={13} /> Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={effectiveStatus === "rejected"}
                    onClick={() => handleManualStatus("rejected")}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold disabled:opacity-40"
                    style={{
                      background: "rgba(239,68,68,0.14)",
                      color: "#f87171",
                      border: "1px solid rgba(239,68,68,0.35)",
                    }}
                  >
                    <XCircle size={13} /> Reject
                  </motion.button>
                </div>
              </div>

              {/* Communicate back to vendor */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCommunicate(submission)}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
              >
                <Mail size={15} /> Communicate back to vendor
              </motion.button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
