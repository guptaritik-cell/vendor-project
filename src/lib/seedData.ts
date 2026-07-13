import type { VendorSubmission } from "@/types/vendor";

const doc = { fileName: "document.pdf", fileType: "application/pdf" };

/**
 * Five hand-crafted submissions for demoing the rules engine end-to-end.
 * Each one is designed to isolate a specific rule outcome:
 *   1. Happy path             -> approved
 *   2. Name mismatch          -> rejected (Name Consistency)
 *   3. Wrong tax ID format    -> rejected (Tax ID Format)
 *   4. Incomplete submission  -> pending (Completeness + Documents)
 *   5. High-value + risky contact -> pending (Risk Threshold only)
 *
 * Built as a factory (not a static array) so "Submitted" timestamps are fresh every time the demo is loaded.
 */
export function createDemoSubmissions(): VendorSubmission[] {
  const now = Date.now();

  return [
    {
      id: `VEN-DEMO-HAPPY-${now}`,
      status: "pending",
      createdAt: new Date(now - 5 * 60_000).toISOString(),
      company: {
        legalName: "Bluewave Logistics Pvt Ltd",
        tradingName: "Bluewave Logistics",
        country: "India",
        registrationNumber: "U01234MH2019PTC111222",
        website: "https://bluewavelogistics.com",
        contactEmail: "accounts@bluewavelogistics.com",
        contactPhone: "+919876543210",
        businessAddress: "45 Nariman Point, Mumbai, India",
      },
      banking: {
        accountHolderName: "Bluewave Logistics Pvt Ltd",
        bankName: "ICICI Bank",
        accountNumber: "000411234567",
        swiftCode: "ICICINBBCTS",
        currency: "INR",
      },
      tax: { taxId: "27AAACB1234C1Z5", taxCountry: "India" },
      documents: { incorporationCert: doc, bankProof: doc, taxRegistration: doc },
      commercial: { category: "Logistics", estimatedAnnualSpend: 45000 },
    },
    {
      id: `VEN-DEMO-NAME-MISMATCH-${now}`,
      status: "pending",
      createdAt: new Date(now - 4 * 60_000).toISOString(),
      company: {
        legalName: "Acme Global Ltd",
        tradingName: "Acme Global",
        country: "United Kingdom",
        registrationNumber: "UK-778899",
        website: "https://acmeglobal.co.uk",
        contactEmail: "finance@acmeglobal.co.uk",
        contactPhone: "+442071234567",
        businessAddress: "10 Fleet Street, London",
      },
      banking: {
        // Subtly different from the company's legal/trading name — only cross-referencing catches this.
        accountHolderName: "Acme Holdings LLC",
        bankName: "Barclays",
        accountNumber: "12345678",
        swiftCode: "BARCGB22",
        currency: "GBP",
      },
      tax: { taxId: "GB123456789", taxCountry: "United Kingdom" },
      documents: { incorporationCert: doc, bankProof: doc, taxRegistration: doc },
      commercial: { category: "Consulting", estimatedAnnualSpend: 30000 },
    },
    {
      id: `VEN-DEMO-WRONG-TAX-ID-${now}`,
      status: "pending",
      createdAt: new Date(now - 3 * 60_000).toISOString(),
      company: {
        legalName: "Nordkraft Industrieteile GmbH",
        tradingName: "Nordkraft",
        country: "Germany",
        registrationNumber: "HRB-445566",
        website: "https://nordkraft.de",
        contactEmail: "buchhaltung@nordkraft.de",
        contactPhone: "+4930123456",
        businessAddress: "12 Unter den Linden, Berlin",
      },
      banking: {
        accountHolderName: "Nordkraft Industrieteile GmbH",
        bankName: "Deutsche Bank",
        accountNumber: "DE44500105175407324931",
        swiftCode: "DEUTDEFF",
        currency: "EUR",
      },
      tax: {
        // UK-style VAT number claimed under a German tax jurisdiction — wrong format/length for Germany.
        taxId: "GB123456789",
        taxCountry: "Germany",
      },
      documents: { incorporationCert: doc, bankProof: doc, taxRegistration: doc },
      commercial: { category: "Manufacturing", estimatedAnnualSpend: 60000 },
    },
    {
      id: `VEN-DEMO-INCOMPLETE-${now}`,
      status: "pending",
      createdAt: new Date(now - 2 * 60_000).toISOString(),
      company: {
        legalName: "Solstice Media Inc",
        tradingName: "Solstice Media",
        country: "United States",
        registrationNumber: "DE-334455",
        website: "https://solsticemedia.com",
        contactEmail: "ap@solsticemedia.com",
        contactPhone: "+12125550100",
        businessAddress: "200 Park Ave, New York",
      },
      banking: {
        accountHolderName: "Solstice Media Inc",
        bankName: "Bank of America",
        accountNumber: "8877665544",
        swiftCode: "", // missing
        currency: "USD",
      },
      tax: { taxId: "45-6789012", taxCountry: "United States" },
      documents: { incorporationCert: doc, bankProof: null, taxRegistration: doc }, // missing
      commercial: { category: "Marketing", estimatedAnnualSpend: 18000 },
    },
    {
      id: `VEN-DEMO-HIGH-RISK-${now}`,
      status: "pending",
      createdAt: new Date(now - 1 * 60_000).toISOString(),
      company: {
        legalName: "Vantage Point Holdings Inc",
        tradingName: "Vantage Point",
        country: "United States",
        registrationNumber: "DE-889900",
        website: "https://vantagepoint.com",
        contactEmail: "director@gmail.com", // free email domain
        contactPhone: "+12125559876",
        businessAddress: "1 Liberty Plaza, New York",
      },
      banking: {
        accountHolderName: "Vantage Point Holdings Inc",
        bankName: "Citibank",
        accountNumber: "1122334455",
        swiftCode: "CITIUS33",
        currency: "USD",
      },
      tax: { taxId: "45-1122334", taxCountry: "United States" },
      documents: { incorporationCert: doc, bankProof: doc, taxRegistration: doc },
      commercial: { category: "Real Estate", estimatedAnnualSpend: 480000 }, // above high-spend threshold
    },
  ];
}
