"use client";

import { FileText, FileX } from "lucide-react";
import type { UploadedDocument, VendorSubmission } from "@/types/vendor";

function Row({ label, value, highlighted }: { label: string; value: string; highlighted: boolean }) {
  return (
    <div
      className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg"
      style={{
        background: highlighted ? "rgba(239,68,68,0.08)" : "transparent",
        border: highlighted ? "1px solid rgba(239,68,68,0.35)" : "1px solid transparent",
      }}
    >
      <span className="text-xs text-[#888888] flex-shrink-0">{label}</span>
      <span className="text-[13px] text-right" style={{ color: highlighted ? "#f87171" : "#F5F5F5" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function DocRow({
  label,
  doc,
  highlighted,
}: {
  label: string;
  doc: UploadedDocument | null;
  highlighted: boolean;
}) {
  const missing = !doc;
  const flagged = highlighted || missing;
  return (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg"
      style={{
        background: flagged ? "rgba(239,68,68,0.08)" : "transparent",
        border: flagged ? "1px solid rgba(239,68,68,0.35)" : "1px solid transparent",
      }}
    >
      <span className="text-xs text-[#888888] flex-shrink-0">{label}</span>
      <span
        className="flex items-center gap-1.5 text-[13px] text-right"
        style={{ color: flagged ? "#f87171" : "#F5F5F5" }}
      >
        {missing ? <FileX size={13} className="flex-shrink-0" /> : <FileText size={13} className="flex-shrink-0" />}
        {doc ? doc.fileName : "Not uploaded"}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#888888] mb-2 uppercase tracking-wide">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/**
 * Read-only view of everything the vendor submitted, with fields implicated by a
 * failing/warning rule highlighted red so a reviewer can see at a glance what to check.
 */
export function SubmissionDetails({
  submission,
  failingFields,
}: {
  submission: VendorSubmission;
  failingFields: Set<string>;
}) {
  const { company, banking, tax, documents, commercial } = submission;
  const has = (field: string) => failingFields.has(field);

  return (
    <div className="space-y-5">
      <Section title="Company">
        <Row label="Legal Name" value={company.legalName} highlighted={has("company.legalName")} />
        <Row label="Trading Name" value={company.tradingName} highlighted={has("company.tradingName")} />
        <Row label="Country of Incorporation" value={company.country} highlighted={has("company.country")} />
        <Row
          label="Registration Number"
          value={company.registrationNumber}
          highlighted={has("company.registrationNumber")}
        />
        <Row label="Website" value={company.website} highlighted={has("company.website")} />
        <Row label="Contact Email" value={company.contactEmail} highlighted={has("company.contactEmail")} />
        <Row label="Contact Phone" value={company.contactPhone} highlighted={has("company.contactPhone")} />
        <Row
          label="Business Address"
          value={company.businessAddress}
          highlighted={has("company.businessAddress")}
        />
      </Section>

      <Section title="Commercial">
        <Row label="Category" value={commercial.category} highlighted={has("commercial.category")} />
        <Row
          label="Est. Annual Spend"
          value={commercial.estimatedAnnualSpend === "" ? "" : `$${Number(commercial.estimatedAnnualSpend).toLocaleString()}`}
          highlighted={has("commercial.estimatedAnnualSpend")}
        />
      </Section>

      <Section title="Banking">
        <Row
          label="Account Holder Name"
          value={banking.accountHolderName}
          highlighted={has("banking.accountHolderName")}
        />
        <Row label="Bank Name" value={banking.bankName} highlighted={has("banking.bankName")} />
        <Row label="Account Number" value={banking.accountNumber} highlighted={has("banking.accountNumber")} />
        <Row label="SWIFT / BIC Code" value={banking.swiftCode} highlighted={has("banking.swiftCode")} />
        <Row label="Settlement Currency" value={banking.currency} highlighted={has("banking.currency")} />
      </Section>

      <Section title="Tax">
        <Row label="Tax ID" value={tax.taxId} highlighted={has("tax.taxId")} />
        <Row label="Tax Jurisdiction Country" value={tax.taxCountry} highlighted={has("tax.taxCountry")} />
      </Section>

      <Section title="Documents">
        <DocRow
          label="Certificate of Incorporation"
          doc={documents.incorporationCert}
          highlighted={has("documents.incorporationCert")}
        />
        <DocRow
          label="Proof of Bank Account"
          doc={documents.bankProof}
          highlighted={has("documents.bankProof")}
        />
        <DocRow
          label="Tax Registration Certificate"
          doc={documents.taxRegistration}
          highlighted={has("documents.taxRegistration")}
        />
      </Section>
    </div>
  );
}
