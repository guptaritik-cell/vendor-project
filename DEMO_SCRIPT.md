# Vendor Onboarding — Demo Script

A walkthrough for demoing the vendor onboarding flow end-to-end, plus the five rules-engine
edge cases. Total runtime: ~6–8 minutes.

## Setup

1. Open the landing page (`/`).
2. If the dashboard already has old data in it, click **Load demo scenarios** on the
   dashboard to reset to a clean, known-good demo set (it prepends 5 fresh scenarios —
   clear browser local storage first if you want a truly empty starting point).

---

## Part 1 — The live submission flow (say: "Let's onboard a real vendor first")

1. On the landing page, click **Submit a Vendor →**.
2. Walk through the multi-step form (Company → Banking → Tax → Documents → Review) with any
   plausible values. Upload placeholder files for the three required documents.
3. Submit. Say: *"That vendor is now sitting in our system — let's see how it got triaged."*
4. Click **Review vendor submissions →** (or navigate to `/dashboard`).
5. Point out the new row at the top of the table with its **Pending** badge — say:
   *"Every submission gets evaluated the instant it lands here, no manual triage queue."*
6. Click the row to open the detail drawer. Walk through the **Rule Audit Trail** —
   say: *"Every decision is fully explainable — six independent checks, each with its own
   reasoning."*
7. Click **Communicate back to vendor** — show the drafted message and the "Message drafted"
   toast. Say: *"And the follow-up email writes itself, in plain language, listing exactly
   what's outstanding."*

---

## Part 2 — The five edge cases (say: "Now let's stress-test the logic")

Click **Load demo scenarios** in the dashboard toolbar. Five new rows appear at the top of
the table, each demonstrating a different rule outcome. Open each in order:

### 1. Bluewave Logistics Pvt Ltd — HAPPY PATH → **Approved**
- Everything is internally consistent: names match, GSTIN is a valid Indian format, currency
  (INR) matches the country, all documents present, spend is unremarkable.
- Say: *"When everything checks out, the badge glows green and there's nothing left for a
  human to do."*
- All six rules in the audit trail show green checks.

### 2. Acme Global Ltd — NAME MISMATCH → **Rejected**
- Legal name is "Acme Global Ltd", but the bank account holder name is "Acme Holdings LLC" —
  a different entity.
- Say: *"On paper this looks fine — right country, right tax ID format, right currency. Only
  cross-referencing the bank details against the company name catches it."*
- Open the drawer: **Name Consistency** is the lone red failure, quoting both names and the
  similarity score (~42%). Click **Communicate back to vendor** to show the rejection email
  asking them to clarify the relationship (e.g. subsidiary, DBA) or correct the banking details.

### 3. Nordkraft Industrieteile GmbH — WRONG TAX ID FOR COUNTRY → **Rejected**
- Vendor claims Germany, but supplied a UK-style VAT number (`GB123456789`) instead of the
  expected `DE` + 9-digit format.
- Say: *"The tax ID regex is country-specific — a UK-shaped number under a German
  jurisdiction fails immediately, even though every other field is clean."*
- Open the drawer: **Tax ID Format** is the lone red failure, quoting the bad tax ID and the
  expected format.

### 4. Solstice Media Inc — INCOMPLETE SUBMISSION → **Pending**
- Missing the SWIFT/BIC code and missing the bank-proof document.
- Say: *"Missing information doesn't get rejected outright — it goes to pending, with a
  precise list of what's still needed."*
- Open the drawer: **Completeness** and **Documents** both fail; the "What's Needed" section
  lists the missing SWIFT/BIC code and the missing bank proof document. Click
  **Communicate back to vendor** to show the drafted email listing exactly those gaps.

### 5. Vantage Point Holdings Inc — HIGH-VALUE / RISK → **Pending**
- Every field is valid and every rule *passes* — but estimated annual spend ($480,000) is
  well above the high-value threshold ($100,000) **and** the contact email is a personal
  Gmail address.
- Say: *"This is the important one — nothing here is technically wrong. But high spend plus
  a non-corporate contact email is exactly the profile we want a human to eyeball before
  money moves. The engine forces manual review even on a clean submission."*
- Open the drawer: five green checks, and only **Risk Threshold** shows the amber warning
  explaining both triggers.

---

## Wrap-up

Say: *"Every one of these decisions is deterministic and auditable — same input, same
output, every time, with the reasoning always visible. Nothing here is a black box."*
