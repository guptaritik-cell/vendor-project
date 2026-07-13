import type { SubmissionStatus, VendorFormData } from "@/types/vendor";

export type RuleOutcome = "passed" | "failed" | "warning";

export interface RuleResult {
  ruleName: string;
  status: RuleOutcome;
  reason: string;
  /** Dot-path field keys (e.g. "company.legalName") implicated by this rule's outcome. */
  fields?: string[];
}

export interface RulesEngineResult {
  status: SubmissionStatus;
  results: RuleResult[];
  whatIsNeeded: string[];
}

/* ── Levenshtein similarity (0 = no match, 1 = identical) ─────────────────── */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(private|pvt|limited|ltd|llc|inc|incorporated|corp|corporation|company|co)\b\.?/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function nameSimilarity(a: string, b: string): number {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return 0;
  const maxLen = Math.max(na.length, nb.length);
  return 1 - levenshteinDistance(na, nb) / maxLen;
}

/* ── Reference data ────────────────────────────────────────────────────────── */
const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "aol.com", "icloud.com", "protonmail.com", "mail.com",
];

const COUNTRY_CURRENCY: Record<string, string> = {
  India: "INR",
  "United States": "USD",
  "United Kingdom": "GBP",
  Singapore: "SGD",
  "United Arab Emirates": "AED",
  Germany: "EUR",
  France: "EUR",
  Netherlands: "EUR",
  Australia: "AUD",
  Canada: "CAD",
  China: "CNY",
  Japan: "JPY",
};

const TAX_ID_PATTERNS: Record<string, RegExp> = {
  India: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/i,
  "United Kingdom": /^(GB)?\d{9}(\d{3})?$/i,
  Germany: /^DE\d{9}$/i,
  "United States": /^\d{2}-\d{7}$/,
};

const HIGH_SPEND_THRESHOLD = 100_000;
const ALLOWED_DOC_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

/* ── Internal: rule outcome + how it affects the overall decision ─────────── */
type Impact = "reject" | "pending" | "none";

interface EvaluatedRule {
  result: RuleResult;
  impact: Impact;
  needed?: string[];
}

/* Rule 1: Completeness ────────────────────────────────────────────────────── */
function evaluateCompleteness(data: VendorFormData): EvaluatedRule {
  const { company, banking, tax, documents, commercial } = data;
  const missing: { label: string; field: string }[] = [];

  if (!company.legalName.trim()) missing.push({ label: "Legal name", field: "company.legalName" });
  if (!company.country) missing.push({ label: "Country of incorporation", field: "company.country" });
  if (!company.registrationNumber.trim())
    missing.push({ label: "Registration number", field: "company.registrationNumber" });
  if (!company.contactEmail.trim()) missing.push({ label: "Contact email", field: "company.contactEmail" });
  if (!company.contactPhone.trim()) missing.push({ label: "Contact phone", field: "company.contactPhone" });
  if (!company.businessAddress.trim())
    missing.push({ label: "Business address", field: "company.businessAddress" });
  if (!commercial.category) missing.push({ label: "Vendor category", field: "commercial.category" });
  if (commercial.estimatedAnnualSpend === "" || Number(commercial.estimatedAnnualSpend) <= 0) {
    missing.push({ label: "Estimated annual spend", field: "commercial.estimatedAnnualSpend" });
  }
  if (!banking.accountHolderName.trim())
    missing.push({ label: "Bank account holder name", field: "banking.accountHolderName" });
  if (!banking.bankName.trim()) missing.push({ label: "Bank name", field: "banking.bankName" });
  if (!banking.accountNumber.trim())
    missing.push({ label: "Bank account number", field: "banking.accountNumber" });
  if (!banking.swiftCode.trim()) missing.push({ label: "SWIFT / BIC code", field: "banking.swiftCode" });
  if (!banking.currency) missing.push({ label: "Settlement currency", field: "banking.currency" });
  if (!tax.taxId.trim()) missing.push({ label: "Tax ID", field: "tax.taxId" });
  if (!tax.taxCountry) missing.push({ label: "Tax jurisdiction country", field: "tax.taxCountry" });
  if (!documents.incorporationCert)
    missing.push({ label: "Certificate of incorporation", field: "documents.incorporationCert" });
  if (!documents.bankProof) missing.push({ label: "Proof of bank account", field: "documents.bankProof" });
  if (!documents.taxRegistration)
    missing.push({ label: "Tax registration certificate", field: "documents.taxRegistration" });

  if (missing.length === 0) {
    return {
      result: { ruleName: "Completeness", status: "passed", reason: "All required fields are present." },
      impact: "none",
    };
  }

  return {
    result: {
      ruleName: "Completeness",
      status: "failed",
      reason: `Missing required field(s): ${missing.map((m) => m.label).join(", ")}.`,
      fields: missing.map((m) => m.field),
    },
    impact: "pending",
    needed: missing.map((m) => `Provide ${m.label}.`),
  };
}

/* Rule 2: Name consistency ─────────────────────────────────────────────────── */
function evaluateNameConsistency(data: VendorFormData): EvaluatedRule {
  const { company, banking } = data;
  if (!banking.accountHolderName.trim() || !company.legalName.trim()) {
    return {
      result: {
        ruleName: "Name Consistency",
        status: "warning",
        reason: "Cannot compare account holder name — legal name or account holder name is missing.",
        fields: ["company.legalName", "banking.accountHolderName"],
      },
      impact: "pending",
    };
  }

  const simLegal = nameSimilarity(banking.accountHolderName, company.legalName);
  const simTrading = company.tradingName.trim()
    ? nameSimilarity(banking.accountHolderName, company.tradingName)
    : 0;
  const bestSim = Math.max(simLegal, simTrading);
  const pct = Math.round(bestSim * 100);

  if (bestSim >= 0.8) {
    return {
      result: {
        ruleName: "Name Consistency",
        status: "passed",
        reason: `Bank account holder name matches the company name (${pct}% similarity).`,
      },
      impact: "none",
    };
  }

  if (bestSim >= 0.5) {
    return {
      result: {
        ruleName: "Name Consistency",
        status: "warning",
        reason: `Bank account holder name is only a partial match to the company name (${pct}% similarity) — needs manual review.`,
        fields: ["company.legalName", "banking.accountHolderName"],
      },
      impact: "pending",
      needed: ["Confirm that the bank account holder name matches the company's legal or trading name."],
    };
  }

  return {
    result: {
      ruleName: "Name Consistency",
      status: "failed",
      reason: `Bank account holder name ("${banking.accountHolderName}") does not match the company name ("${company.legalName}"), only ${pct}% similarity.`,
      fields: ["company.legalName", "banking.accountHolderName"],
    },
    impact: "reject",
    needed: [
      "The bank account holder name must belong to the vendor company — update the banking details or clarify the relationship (e.g. subsidiary, DBA).",
    ],
  };
}

/* Rule 3: Tax ID format ────────────────────────────────────────────────────── */
function evaluateTaxIdFormat(data: VendorFormData): EvaluatedRule {
  const { tax } = data;
  if (!tax.taxId.trim() || !tax.taxCountry) {
    return {
      result: {
        ruleName: "Tax ID Format",
        status: "warning",
        reason: "Tax ID or tax jurisdiction is missing — format could not be checked.",
        fields: ["tax.taxId", "tax.taxCountry"],
      },
      impact: "pending",
    };
  }

  const pattern = TAX_ID_PATTERNS[tax.taxCountry];
  if (!pattern) {
    return {
      result: {
        ruleName: "Tax ID Format",
        status: "warning",
        reason: `No format validation rule is available for "${tax.taxCountry}" — accepted without automated format check.`,
        fields: ["tax.taxId", "tax.taxCountry"],
      },
      impact: "pending",
      needed: [`Manually verify the tax ID format for ${tax.taxCountry}.`],
    };
  }

  if (pattern.test(tax.taxId.trim())) {
    return {
      result: {
        ruleName: "Tax ID Format",
        status: "passed",
        reason: `Tax ID matches the expected ${tax.taxCountry} format.`,
      },
      impact: "none",
    };
  }

  return {
    result: {
      ruleName: "Tax ID Format",
      status: "failed",
      reason: `Tax ID "${tax.taxId}" does not match the expected ${tax.taxCountry} format.`,
      fields: ["tax.taxId"],
    },
    impact: "reject",
    needed: [`Provide a valid ${tax.taxCountry} tax ID.`],
  };
}

/* Rule 4: Country consistency ──────────────────────────────────────────────── */
function evaluateCountryConsistency(data: VendorFormData): EvaluatedRule {
  const { company, tax, banking } = data;
  const issues: string[] = [];
  const needed: string[] = [];
  const fields: string[] = [];

  if (company.country && tax.taxCountry && company.country !== tax.taxCountry) {
    issues.push(`tax jurisdiction (${tax.taxCountry}) differs from country of incorporation (${company.country})`);
    needed.push("Confirm why the tax jurisdiction differs from the country of incorporation, or correct the mismatch.");
    fields.push("company.country", "tax.taxCountry");
  }

  const expectedCurrency = company.country ? COUNTRY_CURRENCY[company.country] : undefined;
  if (expectedCurrency && banking.currency && banking.currency !== expectedCurrency) {
    issues.push(`settlement currency (${banking.currency}) is not the typical currency for ${company.country} (expected ${expectedCurrency})`);
    needed.push(`Confirm settlement currency ${banking.currency} is correct for a vendor based in ${company.country}.`);
    fields.push("company.country", "banking.currency");
  }

  if (issues.length === 0) {
    return {
      result: {
        ruleName: "Country Consistency",
        status: "passed",
        reason: "Tax jurisdiction and settlement currency are consistent with the company's country.",
      },
      impact: "none",
    };
  }

  return {
    result: {
      ruleName: "Country Consistency",
      status: "warning",
      reason: `Potential inconsistency: ${issues.join("; ")}.`,
      fields: Array.from(new Set(fields)),
    },
    impact: "pending",
    needed,
  };
}

/* Rule 5: Documents ────────────────────────────────────────────────────────── */
function evaluateDocuments(data: VendorFormData): EvaluatedRule {
  const { documents } = data;
  const required: [string, string, VendorFormData["documents"]["incorporationCert"]][] = [
    ["Certificate of incorporation", "documents.incorporationCert", documents.incorporationCert],
    ["Proof of bank account", "documents.bankProof", documents.bankProof],
    ["Tax registration certificate", "documents.taxRegistration", documents.taxRegistration],
  ];

  const missing = required.filter(([, , doc]) => !doc);
  if (missing.length > 0) {
    return {
      result: {
        ruleName: "Documents",
        status: "failed",
        reason: `Missing document(s): ${missing.map(([label]) => label).join(", ")}.`,
        fields: missing.map(([, field]) => field),
      },
      impact: "pending",
      needed: missing.map(([label]) => `Upload ${label}.`),
    };
  }

  const badType = required.filter(
    ([, , doc]) => doc && !ALLOWED_DOC_TYPES.includes(doc.fileType)
  );
  if (badType.length > 0) {
    return {
      result: {
        ruleName: "Documents",
        status: "warning",
        reason: `Unexpected file type for: ${badType.map(([label]) => label).join(", ")}. Expected PDF, PNG or JPEG.`,
        fields: badType.map(([, field]) => field),
      },
      impact: "pending",
      needed: badType.map(([label]) => `Re-upload ${label} as a PDF or image file.`),
    };
  }

  return {
    result: {
      ruleName: "Documents",
      status: "passed",
      reason: "All required documents are present and in an accepted file format.",
    },
    impact: "none",
  };
}

/* Rule 6: Risk threshold ───────────────────────────────────────────────────── */
function evaluateRiskThreshold(data: VendorFormData): EvaluatedRule {
  const { commercial, company } = data;
  const reasons: string[] = [];
  const fields: string[] = [];

  const spend = Number(commercial.estimatedAnnualSpend);
  if (commercial.estimatedAnnualSpend !== "" && spend > HIGH_SPEND_THRESHOLD) {
    reasons.push(`estimated annual spend of $${spend.toLocaleString()} exceeds the high-value threshold of $${HIGH_SPEND_THRESHOLD.toLocaleString()}`);
    fields.push("commercial.estimatedAnnualSpend");
  }

  const emailDomain = company.contactEmail.split("@")[1]?.toLowerCase().trim();
  if (emailDomain && FREE_EMAIL_DOMAINS.includes(emailDomain)) {
    reasons.push(`contact email uses a free/personal email domain (${emailDomain})`);
    fields.push("company.contactEmail");
  }

  if (reasons.length === 0) {
    return {
      result: {
        ruleName: "Risk Threshold",
        status: "passed",
        reason: "No high-risk indicators detected.",
      },
      impact: "none",
    };
  }

  return {
    result: {
      ruleName: "Risk Threshold",
      status: "warning",
      reason: `Flagged for manual review: ${reasons.join("; ")}.`,
      fields,
    },
    impact: "pending",
    needed: ["This submission requires manual risk review before approval."],
  };
}

/* ── Engine ───────────────────────────────────────────────────────────────── */
export function evaluateVendorSubmission(data: VendorFormData): RulesEngineResult {
  const evaluations: EvaluatedRule[] = [
    evaluateCompleteness(data),
    evaluateNameConsistency(data),
    evaluateTaxIdFormat(data),
    evaluateCountryConsistency(data),
    evaluateDocuments(data),
    evaluateRiskThreshold(data),
  ];

  const hasReject = evaluations.some((e) => e.impact === "reject");
  const hasPending = evaluations.some((e) => e.impact === "pending");

  let status: SubmissionStatus;
  if (hasReject) status = "rejected";
  else if (hasPending) status = "pending";
  else status = "approved";

  const whatIsNeeded = Array.from(
    new Set(evaluations.flatMap((e) => e.needed ?? []))
  );

  return {
    status,
    results: evaluations.map((e) => e.result),
    whatIsNeeded,
  };
}

/** Dot-path field keys flagged by any non-passed rule — used to highlight the submitted-details view. */
export function getFailingFields(result: RulesEngineResult): Set<string> {
  const fields = new Set<string>();
  for (const rule of result.results) {
    if (rule.status !== "passed") {
      for (const field of rule.fields ?? []) fields.add(field);
    }
  }
  return fields;
}

/**
 * A submission's decision, preferring a manual reviewer override over the
 * rules-engine's computed status when one has been set.
 */
export function getEffectiveStatus(submission: VendorFormData & { manualStatus?: SubmissionStatus | null }): SubmissionStatus {
  return submission.manualStatus ?? evaluateVendorSubmission(submission).status;
}
