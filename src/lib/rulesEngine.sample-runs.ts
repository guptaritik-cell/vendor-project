import { evaluateVendorSubmission } from "./rulesEngine";
import type { VendorFormData } from "@/types/vendor";

const doc = (fileName: string, fileType = "application/pdf") => ({ fileName, fileType });

/* Clean submission — should approve */
const approvedCase: VendorFormData = {
  company: {
    legalName: "Nimbus Traders Private Limited",
    tradingName: "Nimbus Foods",
    country: "India",
    registrationNumber: "U74999DL2019PTC123456",
    website: "https://nimbustraders.com",
    contactEmail: "accounts@nimbustraders.com",
    contactPhone: "+91 98765 43210",
    businessAddress: "12 MG Road, New Delhi, India",
  },
  banking: {
    accountHolderName: "Nimbus Traders Private Limited",
    bankName: "HDFC Bank",
    accountNumber: "50100123456789",
    swiftCode: "HDFCINBB",
    currency: "INR",
  },
  tax: { taxId: "07AAFCN1234M1ZP", taxCountry: "India" },
  documents: {
    incorporationCert: doc("incorporation.pdf"),
    bankProof: doc("bank_proof.pdf"),
    taxRegistration: doc("gstin_certificate.pdf"),
  },
  commercial: { category: "Food & Beverage", estimatedAnnualSpend: 40000 },
};

/* Missing fields + free email + name mismatch (warning-level) — should be pending */
const pendingCase: VendorFormData = {
  ...approvedCase,
  company: {
    ...approvedCase.company,
    contactEmail: "owner@gmail.com",
    registrationNumber: "",
  },
  banking: {
    ...approvedCase.banking,
    accountHolderName: "Nimbus Trading Co",
  },
  commercial: { category: "Food & Beverage", estimatedAnnualSpend: 250000 },
};

/* Clear name mismatch — should reject */
const rejectedCaseNameMismatch: VendorFormData = {
  ...approvedCase,
  banking: {
    ...approvedCase.banking,
    accountHolderName: "Zephyr Logistics Ltd",
  },
};

/* Malformed tax ID for the declared jurisdiction — should reject */
const rejectedCaseTaxId: VendorFormData = {
  ...approvedCase,
  tax: { taxId: "NOT-A-VALID-GSTIN", taxCountry: "India" },
};

/* Country/currency mismatch — should be pending (warning) */
const pendingCaseCountryMismatch: VendorFormData = {
  ...approvedCase,
  tax: { taxId: "GB123456789", taxCountry: "United Kingdom" },
  banking: { ...approvedCase.banking, currency: "USD" },
};

function run(label: string, data: VendorFormData) {
  const result = evaluateVendorSubmission(data);
  console.log(`\n=== ${label} → ${result.status.toUpperCase()} ===`);
  for (const r of result.results) {
    console.log(`  [${r.status.padEnd(7)}] ${r.ruleName}: ${r.reason}`);
  }
  if (result.whatIsNeeded.length > 0) {
    console.log("  What's needed:");
    for (const item of result.whatIsNeeded) console.log(`    - ${item}`);
  }
}

run("Clean submission", approvedCase);
run("Missing fields + high spend + free email", pendingCase);
run("Bank name clearly mismatched", rejectedCaseNameMismatch);
run("Malformed GSTIN for India", rejectedCaseTaxId);
run("Tax country / currency mismatch", pendingCaseCountryMismatch);
