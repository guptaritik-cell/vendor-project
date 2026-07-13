"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { DarkSelect, FieldError, FileUploadField, Label, TextField } from "./fields";
import type {
  VendorBanking,
  VendorCommercial,
  VendorCompany,
  VendorDocuments,
  VendorTax,
} from "@/types/vendor";

export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Singapore", "United Arab Emirates",
  "Germany", "France", "Netherlands", "Australia", "Canada", "China", "Japan", "Other",
];

export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "SGD", "AED", "AUD", "CAD", "JPY", "CNY"];

export const CATEGORIES = [
  "Food & Beverage", "Logistics & Fulfilment", "IT & Software Services", "Office Supplies",
  "Professional Services", "Marketing & Advertising", "Manufacturing & Raw Materials",
  "Facilities & Maintenance", "Travel & Hospitality", "Other",
];

type Errors = Record<string, string>;

/* ── Step 1: Company + Commercial ─────────────────────────────────────────── */
export function CompanyStep({
  company,
  commercial,
  errors,
  onCompanyChange,
  onCommercialChange,
}: {
  company: VendorCompany;
  commercial: VendorCommercial;
  errors: Errors;
  onCompanyChange: (field: keyof VendorCompany, value: string) => void;
  onCommercialChange: (field: keyof VendorCommercial, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <TextField
        label="Legal Name"
        required
        value={company.legalName}
        onChange={(v) => onCompanyChange("legalName", v)}
        placeholder="e.g. Nimbus Traders Private Limited"
        error={errors.legalName}
      />
      <TextField
        label="Trading Name"
        value={company.tradingName}
        onChange={(v) => onCompanyChange("tradingName", v)}
        placeholder="e.g. Nimbus Foods"
        error={errors.tradingName}
      />
      <div className="grid grid-cols-2 gap-4">
        <DarkSelect
          label="Country of Incorporation"
          required
          value={company.country}
          onChange={(v) => onCompanyChange("country", v)}
          options={COUNTRIES}
          error={errors.country}
        />
        <TextField
          label="Registration Number"
          required
          value={company.registrationNumber}
          onChange={(v) => onCompanyChange("registrationNumber", v)}
          placeholder="e.g. U74999DL2019PTC123456"
          error={errors.registrationNumber}
        />
      </div>
      <TextField
        label="Website"
        value={company.website}
        onChange={(v) => onCompanyChange("website", v)}
        placeholder="https://example.com"
        error={errors.website}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Contact Email"
          required
          type="email"
          value={company.contactEmail}
          onChange={(v) => onCompanyChange("contactEmail", v)}
          placeholder="accounts@example.com"
          error={errors.contactEmail}
        />
        <TextField
          label="Contact Phone"
          required
          value={company.contactPhone}
          onChange={(v) => onCompanyChange("contactPhone", v)}
          placeholder="+91 98765 43210"
          error={errors.contactPhone}
        />
      </div>
      <div>
        <Label required>Business Address</Label>
        <textarea
          value={company.businessAddress}
          onChange={(e) => onCompanyChange("businessAddress", e.target.value)}
          placeholder="Registered office address"
          rows={2}
          className="w-full text-sm rounded-md px-3 py-2 outline-none transition-colors resize-none"
          style={{
            background: "#1E1E1E",
            border: `1px solid ${errors.businessAddress ? "rgba(239,68,68,0.6)" : "rgba(255,77,0,0.25)"}`,
            color: "#F5F5F5",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#FF4D00";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.businessAddress
              ? "rgba(239,68,68,0.6)"
              : "rgba(255,77,0,0.25)";
          }}
        />
        <FieldError msg={errors.businessAddress} />
      </div>

      {/* Commercial subsection */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,77,0,0.12)" }}>
        <p className="text-xs font-semibold text-[#FF7A35] mb-4 uppercase tracking-wide">
          Commercial Details
        </p>
        <div className="grid grid-cols-2 gap-4">
          <DarkSelect
            label="Vendor Category"
            required
            value={commercial.category}
            onChange={(v) => onCommercialChange("category", v)}
            options={CATEGORIES}
            error={errors.category}
          />
          <TextField
            label="Estimated Annual Spend (USD)"
            required
            type="number"
            value={String(commercial.estimatedAnnualSpend)}
            onChange={(v) => onCommercialChange("estimatedAnnualSpend", v)}
            placeholder="e.g. 50000"
            error={errors.estimatedAnnualSpend}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Banking ───────────────────────────────────────────────────────── */
export function BankingStep({
  banking,
  errors,
  onChange,
}: {
  banking: VendorBanking;
  errors: Errors;
  onChange: (field: keyof VendorBanking, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <TextField
        label="Account Holder Name"
        required
        value={banking.accountHolderName}
        onChange={(v) => onChange("accountHolderName", v)}
        placeholder="As it appears on the bank account"
        error={errors.accountHolderName}
      />
      <TextField
        label="Bank Name"
        required
        value={banking.bankName}
        onChange={(v) => onChange("bankName", v)}
        placeholder="e.g. HDFC Bank"
        error={errors.bankName}
      />
      <TextField
        label="Account Number"
        required
        value={banking.accountNumber}
        onChange={(v) => onChange("accountNumber", v)}
        placeholder="Bank account number"
        error={errors.accountNumber}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="SWIFT / BIC Code"
          required
          value={banking.swiftCode}
          onChange={(v) => onChange("swiftCode", v.toUpperCase())}
          placeholder="e.g. HDFCINBB"
          error={errors.swiftCode}
        />
        <DarkSelect
          label="Settlement Currency"
          required
          value={banking.currency}
          onChange={(v) => onChange("currency", v)}
          options={CURRENCIES}
          error={errors.currency}
        />
      </div>
    </div>
  );
}

/* ── Step 3: Tax ───────────────────────────────────────────────────────────── */
export function TaxStep({
  tax,
  errors,
  onChange,
}: {
  tax: VendorTax;
  errors: Errors;
  onChange: (field: keyof VendorTax, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <TextField
        label="Tax ID (VAT / GST / Tax Number)"
        required
        value={tax.taxId}
        onChange={(v) => onChange("taxId", v)}
        placeholder="e.g. 07AAFCN1234M1ZP"
        error={errors.taxId}
      />
      <DarkSelect
        label="Tax Jurisdiction Country"
        required
        value={tax.taxCountry}
        onChange={(v) => onChange("taxCountry", v)}
        options={COUNTRIES}
        error={errors.taxCountry}
      />
    </div>
  );
}

/* ── Step 4: Documents ─────────────────────────────────────────────────────── */
export function DocumentsStep({
  documents,
  errors,
  onChange,
}: {
  documents: VendorDocuments;
  errors: Errors;
  onChange: (field: keyof VendorDocuments, value: VendorDocuments[keyof VendorDocuments]) => void;
}) {
  return (
    <div className="space-y-5">
      <FileUploadField
        label="Certificate of Incorporation"
        required
        value={documents.incorporationCert}
        onChange={(v) => onChange("incorporationCert", v)}
        error={errors.incorporationCert}
      />
      <FileUploadField
        label="Proof of Bank Account"
        required
        value={documents.bankProof}
        onChange={(v) => onChange("bankProof", v)}
        error={errors.bankProof}
      />
      <FileUploadField
        label="Tax Registration Certificate"
        required
        value={documents.taxRegistration}
        onChange={(v) => onChange("taxRegistration", v)}
        error={errors.taxRegistration}
      />
    </div>
  );
}

/* ── Step 5: Review ────────────────────────────────────────────────────────── */
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-[#888888] flex-shrink-0">{label}</span>
      <span className="text-sm text-[#F5F5F5] text-right break-words">{value || "—"}</span>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl px-4 py-3"
      style={{ background: "#1E1E1E", border: "1px solid rgba(255,77,0,0.15)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-[#FF7A35] uppercase tracking-wide">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[11px] text-[#888888] hover:text-[#FF7A35] transition-colors"
        >
          <Pencil size={11} /> Edit
        </button>
      </div>
      <div className="divide-y divide-[rgba(255,77,0,0.08)]">{children}</div>
    </motion.div>
  );
}

export function ReviewStep({
  company,
  banking,
  tax,
  documents,
  commercial,
  onEdit,
}: {
  company: VendorCompany;
  banking: VendorBanking;
  tax: VendorTax;
  documents: VendorDocuments;
  commercial: VendorCommercial;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="space-y-4">
      <ReviewSection title="Company & Commercial" onEdit={() => onEdit(0)}>
        <ReviewRow label="Legal Name" value={company.legalName} />
        <ReviewRow label="Trading Name" value={company.tradingName} />
        <ReviewRow label="Country" value={company.country} />
        <ReviewRow label="Registration Number" value={company.registrationNumber} />
        <ReviewRow label="Website" value={company.website} />
        <ReviewRow label="Contact Email" value={company.contactEmail} />
        <ReviewRow label="Contact Phone" value={company.contactPhone} />
        <ReviewRow label="Business Address" value={company.businessAddress} />
        <ReviewRow label="Category" value={commercial.category} />
        <ReviewRow
          label="Est. Annual Spend"
          value={commercial.estimatedAnnualSpend ? `$${Number(commercial.estimatedAnnualSpend).toLocaleString()}` : ""}
        />
      </ReviewSection>

      <ReviewSection title="Banking" onEdit={() => onEdit(1)}>
        <ReviewRow label="Account Holder" value={banking.accountHolderName} />
        <ReviewRow label="Bank Name" value={banking.bankName} />
        <ReviewRow label="Account Number" value={banking.accountNumber} />
        <ReviewRow label="SWIFT / BIC" value={banking.swiftCode} />
        <ReviewRow label="Currency" value={banking.currency} />
      </ReviewSection>

      <ReviewSection title="Tax" onEdit={() => onEdit(2)}>
        <ReviewRow label="Tax ID" value={tax.taxId} />
        <ReviewRow label="Tax Country" value={tax.taxCountry} />
      </ReviewSection>

      <ReviewSection title="Documents" onEdit={() => onEdit(3)}>
        <ReviewRow label="Incorporation Cert." value={documents.incorporationCert?.fileName ?? ""} />
        <ReviewRow label="Bank Proof" value={documents.bankProof?.fileName ?? ""} />
        <ReviewRow label="Tax Registration" value={documents.taxRegistration?.fileName ?? ""} />
      </ReviewSection>
    </div>
  );
}
