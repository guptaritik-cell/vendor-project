"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2, Landmark, Receipt, FileText, ClipboardCheck,
  ArrowLeft, ArrowRight, Send, Loader2, Sparkles,
} from "lucide-react";
import { StepProgress, type StepDef } from "@/components/vendor/step-progress";
import { CompanyStep, BankingStep, TaxStep, DocumentsStep, ReviewStep } from "@/components/vendor/steps";
import { useVendorStore } from "@/lib/store";
import { getSampleVendorData } from "@/lib/sample-vendor";
import {
  EMPTY_VENDOR_FORM,
  type VendorBanking,
  type VendorCommercial,
  type VendorCompany,
  type VendorDocuments,
  type VendorFormData,
  type VendorTax,
} from "@/types/vendor";

type Errors = Record<string, string>;

const STEPS: StepDef[] = [
  { key: "company", label: "Company", icon: Building2 },
  { key: "banking", label: "Banking", icon: Landmark },
  { key: "tax", label: "Tax", icon: Receipt },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "review", label: "Review", icon: ClipboardCheck },
];

function validateCompanyStep(company: VendorCompany, commercial: VendorCommercial): Errors {
  const e: Errors = {};
  if (!company.legalName.trim()) e.legalName = "Legal name is required";
  if (!company.country) e.country = "Country is required";
  if (!company.registrationNumber.trim()) e.registrationNumber = "Registration number is required";
  if (!company.contactEmail.trim()) {
    e.contactEmail = "Contact email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.contactEmail.trim())) {
    e.contactEmail = "Enter a valid email address";
  }
  if (!company.contactPhone.trim()) e.contactPhone = "Contact phone is required";
  if (!company.businessAddress.trim()) e.businessAddress = "Business address is required";
  if (company.website.trim() && !/^https?:\/\/.+\..+/i.test(company.website.trim())) {
    e.website = "Enter a valid URL starting with http:// or https://";
  }
  if (!commercial.category) e.category = "Vendor category is required";
  const spend = Number(commercial.estimatedAnnualSpend);
  if (commercial.estimatedAnnualSpend === "" || Number.isNaN(spend)) {
    e.estimatedAnnualSpend = "Estimated annual spend is required";
  } else if (spend <= 0) {
    e.estimatedAnnualSpend = "Must be greater than 0";
  }
  return e;
}

function validateBankingStep(banking: VendorBanking): Errors {
  const e: Errors = {};
  if (!banking.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
  if (!banking.bankName.trim()) e.bankName = "Bank name is required";
  if (!banking.accountNumber.trim()) {
    e.accountNumber = "Account number is required";
  } else if (!/^[A-Za-z0-9]{6,34}$/.test(banking.accountNumber.trim())) {
    e.accountNumber = "Enter a valid account number";
  }
  if (!banking.swiftCode.trim()) {
    e.swiftCode = "SWIFT / BIC code is required";
  } else if (!/^[A-Z0-9]{8}([A-Z0-9]{3})?$/i.test(banking.swiftCode.trim())) {
    e.swiftCode = "Enter a valid 8 or 11 character SWIFT/BIC code";
  }
  if (!banking.currency) e.currency = "Settlement currency is required";
  return e;
}

function validateTaxStep(tax: VendorTax): Errors {
  const e: Errors = {};
  if (!tax.taxId.trim()) e.taxId = "Tax ID is required";
  if (!tax.taxCountry) e.taxCountry = "Tax jurisdiction is required";
  return e;
}

function validateDocumentsStep(documents: VendorDocuments): Errors {
  const e: Errors = {};
  if (!documents.incorporationCert) e.incorporationCert = "Certificate of incorporation is required";
  if (!documents.bankProof) e.bankProof = "Proof of bank account is required";
  if (!documents.taxRegistration) e.taxRegistration = "Tax registration certificate is required";
  return e;
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
};

export default function OnboardPage() {
  const router = useRouter();
  const addSubmission = useVendorStore((s) => s.addSubmission);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<VendorFormData>(EMPTY_VENDOR_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepValidators = [
    () => validateCompanyStep(formData.company, formData.commercial),
    () => validateBankingStep(formData.banking),
    () => validateTaxStep(formData.tax),
    () => validateDocumentsStep(formData.documents),
  ];

  function clearError(field: string) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  }

  function updateCompany(field: keyof VendorCompany, value: string) {
    setFormData((p) => ({ ...p, company: { ...p.company, [field]: value } }));
    clearError(field);
  }

  function updateCommercial(field: keyof VendorCommercial, value: string) {
    setFormData((p) => ({
      ...p,
      commercial: {
        ...p.commercial,
        [field]: field === "estimatedAnnualSpend" ? (value === "" ? "" : Number(value)) : value,
      },
    }));
    clearError(field);
  }

  function updateBanking(field: keyof VendorBanking, value: string) {
    setFormData((p) => ({ ...p, banking: { ...p.banking, [field]: value } }));
    clearError(field);
  }

  function updateTax(field: keyof VendorTax, value: string) {
    setFormData((p) => ({ ...p, tax: { ...p.tax, [field]: value } }));
    clearError(field);
  }

  function updateDocuments(field: keyof VendorDocuments, value: VendorDocuments[keyof VendorDocuments]) {
    setFormData((p) => ({ ...p, documents: { ...p.documents, [field]: value } }));
    clearError(field);
  }

  function goToStep(target: number) {
    setErrors({});
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  function handleNext() {
    const stepErrors = stepValidators[step]();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fix the highlighted fields before continuing");
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleLoadSample() {
    setFormData(getSampleVendorData());
    setErrors({});
    toast.success("Sample vendor data loaded");
  }

  async function handleSubmit() {
    for (let i = 0; i < stepValidators.length; i++) {
      const stepErrors = stepValidators[i]();
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        goToStep(i);
        toast.error("Please complete all required fields before submitting");
        return;
      }
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const submission = addSubmission(formData);
    toast.success("Vendor submission received");
    router.push(`/submissions/${submission.id}`);
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-screen px-6 pb-10 flex flex-col items-center bg-[#0D0D0D]">
      <div
        className="sticky top-0 z-20 w-full flex justify-center px-6 py-4 -mx-6"
        style={{ background: "#0D0D0D", borderBottom: "1px solid rgba(255,77,0,0.12)" }}
      >
        <div className="w-full max-w-[640px]">
          <StepProgress steps={STEPS} current={step} />
        </div>
      </div>

      <div className="h-8" />

      <div
        className="w-full max-w-[640px] rounded-2xl overflow-hidden"
        style={{
          background: "#181818",
          border: "1px solid rgba(255,77,0,0.3)",
          boxShadow: "0 0 40px rgba(255,77,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 flex items-center justify-between gap-4"
          style={{ borderBottom: "1px solid rgba(255,77,0,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,77,0,0.15)" }}
            >
              <Building2 size={18} className="text-[#FF7A35]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F5F5F5]">Vendor Submission</h2>
              <p className="text-xs text-[#888888] mt-0.5">
                Step {step + 1} of {STEPS.length} &middot; {STEPS[step].label}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            style={{
              background: "rgba(255,77,0,0.1)",
              color: "#FF7A35",
              border: "1px solid rgba(255,77,0,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,77,0,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,77,0,0.1)";
            }}
          >
            <Sparkles size={13} /> Load sample
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {step === 0 && (
                <CompanyStep
                  company={formData.company}
                  commercial={formData.commercial}
                  errors={errors}
                  onCompanyChange={updateCompany}
                  onCommercialChange={updateCommercial}
                />
              )}
              {step === 1 && (
                <BankingStep banking={formData.banking} errors={errors} onChange={updateBanking} />
              )}
              {step === 2 && (
                <TaxStep tax={formData.tax} errors={errors} onChange={updateTax} />
              )}
              {step === 3 && (
                <DocumentsStep
                  documents={formData.documents}
                  errors={errors}
                  onChange={updateDocuments}
                />
              )}
              {step === 4 && (
                <ReviewStep
                  company={formData.company}
                  banking={formData.banking}
                  tax={formData.tax}
                  documents={formData.documents}
                  commercial={formData.commercial}
                  onEdit={goToStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-5 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,77,0,0.15)" }}
        >
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors text-[#888888] hover:text-[#F5F5F5]"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #FF4D00, #FF7A35)",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Submitting…
              </>
            ) : isLastStep ? (
              <>
                <Send size={15} /> Submit Vendor Submission
              </>
            ) : (
              <>
                Next <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
