import type { VendorSubmission } from "@/types/vendor";
import type { RulesEngineResult } from "@/lib/rulesEngine";

/** Builds a plain-language draft message to send back to a vendor, based on the rules engine result. */
export function generateVendorMessage(submission: VendorSubmission, result: RulesEngineResult): string {
  const contactName = submission.company.tradingName || submission.company.legalName || "Vendor";
  const lines: string[] = [];

  lines.push(`Subject: Update on your vendor onboarding submission (${submission.id})`);
  lines.push("");
  lines.push(`Hi ${contactName} team,`);
  lines.push("");

  if (result.status === "approved") {
    lines.push(
      "Thank you for submitting your vendor onboarding details. We've reviewed your submission and everything checks out — you're approved as a vendor with POP Private Limited."
    );
    lines.push("");
    lines.push("No further action is needed from your side. We'll be in touch to begin onboarding.");
  } else if (result.status === "pending") {
    lines.push(
      "Thank you for submitting your vendor onboarding details. Your submission is currently under manual review before we can finalize your vendor status."
    );
    if (result.whatIsNeeded.length > 0) {
      lines.push("");
      lines.push("To help us move things along, could you please confirm or provide the following:");
      for (const item of result.whatIsNeeded) lines.push(`  - ${item}`);
    }
    lines.push("");
    lines.push("We'll follow up as soon as the review is complete.");
  } else {
    lines.push(
      "Thank you for submitting your vendor onboarding details. Unfortunately, we're unable to approve this submission in its current form."
    );
    if (result.whatIsNeeded.length > 0) {
      lines.push("");
      lines.push("Please address the following before resubmitting:");
      for (const item of result.whatIsNeeded) lines.push(`  - ${item}`);
    }
    lines.push("");
    lines.push("Once corrected, please submit a new vendor onboarding form and we'll take another look.");
  }

  lines.push("");
  lines.push("Best regards,");
  lines.push("POP Vendor Onboarding Team");

  return lines.join("\n");
}
