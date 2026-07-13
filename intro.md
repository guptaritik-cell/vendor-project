0:00 – 0:40] — Introduction & Problem Statement

"Hi everyone. Today I want to walk you through the Vendor Onboarding project I built, and explain the problem it solves, how it works, and what we can do next to make it even bigger.

So first, the problem. Right now, when a new vendor wants to work with us, they fill in a lot of details — company info, bank details, tax details, and documents. Someone from our team then has to manually check every single field. Is the bank account name matching the company name? Is the tax ID in the right format? Did they upload the right documents? This manual checking takes time, and it's easy to miss mistakes when you're checking by hand.

So the goal was simple: build a system that automatically checks vendor submissions against a set of rules, flags anything wrong, and gives our team a clean dashboard to review and approve or reject vendors — without needing to dig through every field by hand."

[0:40 – 1:30] — The Vendor Submission Form

"Let's start from the vendor's side. There's a step-by-step form the vendor fills out. It's broken into five steps — Company details, Banking details, Tax details, Documents, and a final Review step.

At the top of this form, there's a progress bar showing which step you're on. I made this progress bar sticky, meaning it stays fixed at the top of the screen even when you scroll down. So no matter how long the form is, the vendor always knows exactly where they are in the process.

Once the vendor fills everything and submits, the system creates a submission record and sends it into our review pipeline."

[1:30 – 2:40] — The Rules Engine

"Now here's the core part — the rules engine. This is the brain of the whole system. Every time a submission comes in, it's automatically checked against six rules:

One, Completeness — did the vendor fill in every required field and upload every required document?

Two, Name Consistency — does the bank account holder name match the company's legal name? This catches cases where someone might be trying to redirect payments to a different account.

Three, Tax ID Format — is the tax ID in the correct format for that country?

Four, Country Consistency — does the tax country and the bank currency match the company's registered country?

Five, Documents — are all the required documents uploaded, and are they the right file type?

And six, Risk Threshold — this flags vendors with unusually high spend amounts or suspicious contact details for extra scrutiny.

Each rule gives a clear pass, warning, or fail result, along with a plain-English reason. All these results combine into one final decision — Approved, Pending, or Rejected."

[2:40 – 3:40] — The Review Dashboard

"Now let's look at the dashboard, which is what our internal team actually uses.

At the top, we see total submissions, and a quick count of how many are approved, pending, and rejected. Below that, there's a table listing every vendor submission with their status.

When you click on any vendor, a details panel opens on the right. This is where it gets useful. There are two tabs here.

The first tab, 'Rule Audit Trail', shows exactly which rules passed and which failed, with the reason for each — so our team instantly understands why a vendor was flagged, instead of guessing.

The second tab, 'Submitted Details', shows everything the vendor actually typed in and uploaded — every field, every document. And here's the important part — if a field is the reason a rule failed, that field is highlighted in red. So if the bank account name doesn't match, that exact field turns red. If a document is missing, that row turns red too. This means our reviewer doesn't have to read through everything — their eyes go straight to the problem."

[3:40 – 4:20] — Manual Approve and Reject

"Now, the system's automatic decision is a starting point, not the final word. Our team still has full control. In that same panel, there's a Manual Review section with Approve and Reject buttons.

If our reviewer looks at a flagged vendor and decides it's actually fine, they can click Approve, and that overrides the automatic decision immediately. The dashboard, the counts, and the status badge all update instantly. If they change their mind later, there's a 'Revert to automatic' option that goes back to what the rules engine originally decided.

There's also a 'Communicate back to vendor' button, which auto-generates a message explaining what's missing or wrong, so our team doesn't have to write that email from scratch every time."

[4:20 – 5:00] — What's Next / Scalability

"So that's the full solution today. Now, what can we scale next?

First, right now the data is stored locally in the browser — for a real production version, we'd connect this to an actual database and backend, so data is safe and shared across the whole team.

Second, we can add user roles and login, so we know exactly who approved or rejected each vendor, for accountability.

Third, we can add automatic document verification — using OCR or AI to actually read the uploaded certificate and tax documents, and cross-check the details automatically, instead of just checking if a file was uploaded.

Fourth, we can connect this system directly to our vendor payment or ERP system, so once a vendor is approved, they're automatically added there — no manual re-entry.

Fifth, we can make the rules configurable — so instead of hardcoding rules in code, someone from finance or compliance can update thresholds and rules through a settings screen, without needing a developer.

And finally, we can add email or WhatsApp notifications, so vendors are automatically told the moment their status changes, and our reviewers get notified when a high-risk vendor comes in.

That's the project — a system that takes a manual, slow, error-prone process and makes it fast, consistent, and transparent, while still keeping a human in control of the final decision. Thank you."
