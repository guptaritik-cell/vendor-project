"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, FileText, Info, Plus, ArrowLeft } from "lucide-react";
import { useVendorStore } from "@/lib/store";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-[#888888] flex-shrink-0">{label}</span>
      <span className="text-sm text-[#F5F5F5] text-right break-words">{value || "—"}</span>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: "#1E1E1E", border: "1px solid rgba(255,77,0,0.15)" }}
    >
      <p className="text-xs font-semibold text-[#FF7A35] uppercase tracking-wide mb-1">{title}</p>
      <div className="divide-y divide-[rgba(255,77,0,0.08)]">{children}</div>
    </div>
  );
}

export default function SubmissionConfirmationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const submission = useVendorStore((s) => s.getSubmission(params.id));

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0D0D0D] text-center gap-4">
        <p className="text-lg font-semibold text-[#F5F5F5]">Submission not found</p>
        <p className="text-sm text-[#888888] max-w-sm">
          This submission doesn&apos;t exist, or your browser storage was cleared.
        </p>
        <button
          onClick={() => router.push("/onboard")}
          className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
        >
          <ArrowLeft size={15} /> Back to form
        </button>
      </div>
    );
  }

  const { company, banking, tax, documents, commercial, id, status, createdAt } = submission;

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center bg-[#0D0D0D]">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 mb-8 text-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px rgba(255,166,0,0.3)",
              "0 0 24px rgba(255,166,0,0.5)",
              "0 0 0px rgba(255,166,0,0.3)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,166,0,0.14)" }}
        >
          <Clock size={24} className="text-[#FFA500]" />
        </motion.div>
        <h1 className="text-2xl font-semibold text-[#F5F5F5]">Submission Received</h1>
        <p className="text-sm text-[#888888] max-w-md">
          <span className="font-mono text-[#FF7A35]">{id}</span> is now{" "}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide align-middle"
            style={{ background: "rgba(255,166,0,0.15)", color: "#FFA500" }}
          >
            {status}
          </span>{" "}
          for review.
        </p>
        <p className="text-[11px] text-[#666666]">
          Submitted {new Date(createdAt).toLocaleString()}
        </p>
      </motion.div>

      {/* Reasoning placeholder note */}
      <div
        className="w-full max-w-[640px] flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
        style={{ background: "rgba(255,77,0,0.06)", border: "1px solid rgba(255,77,0,0.2)" }}
      >
        <Info size={15} className="text-[#FF7A35] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#AAAAAA] leading-relaxed">
          Automatic decisioning isn&apos;t enabled yet — this submission will stay{" "}
          <span className="text-[#FFA500] font-medium">pending</span> until the review rules
          engine is built. Once it is, the approve / reject reasoning will appear here.
        </p>
      </div>

      {/* Summary */}
      <div className="w-full max-w-[640px] space-y-4">
        <SummaryCard title="Company & Commercial">
          <SummaryRow label="Legal Name" value={company.legalName} />
          <SummaryRow label="Trading Name" value={company.tradingName} />
          <SummaryRow label="Country" value={company.country} />
          <SummaryRow label="Registration Number" value={company.registrationNumber} />
          <SummaryRow label="Website" value={company.website} />
          <SummaryRow label="Contact Email" value={company.contactEmail} />
          <SummaryRow label="Contact Phone" value={company.contactPhone} />
          <SummaryRow label="Business Address" value={company.businessAddress} />
          <SummaryRow label="Category" value={commercial.category} />
          <SummaryRow
            label="Est. Annual Spend"
            value={commercial.estimatedAnnualSpend ? `$${Number(commercial.estimatedAnnualSpend).toLocaleString()}` : ""}
          />
        </SummaryCard>

        <SummaryCard title="Banking">
          <SummaryRow label="Account Holder" value={banking.accountHolderName} />
          <SummaryRow label="Bank Name" value={banking.bankName} />
          <SummaryRow label="Account Number" value={banking.accountNumber} />
          <SummaryRow label="SWIFT / BIC" value={banking.swiftCode} />
          <SummaryRow label="Currency" value={banking.currency} />
        </SummaryCard>

        <SummaryCard title="Tax">
          <SummaryRow label="Tax ID" value={tax.taxId} />
          <SummaryRow label="Tax Country" value={tax.taxCountry} />
        </SummaryCard>

        <SummaryCard title="Documents">
          {[documents.incorporationCert, documents.bankProof, documents.taxRegistration].map(
            (doc, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <FileText size={13} className="text-[#FF7A35] flex-shrink-0" />
                <span className="text-sm text-[#F5F5F5] truncate">
                  {doc?.fileName ?? "—"}
                </span>
              </div>
            )
          )}
        </SummaryCard>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-[#888888] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft size={15} /> Back to home
        </button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/onboard")}
          className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #FF4D00, #FF7A35)" }}
        >
          <Plus size={15} /> Submit another vendor
        </motion.button>
      </div>
    </div>
  );
}
