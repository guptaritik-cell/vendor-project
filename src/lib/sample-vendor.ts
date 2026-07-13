import type { VendorFormData } from "@/types/vendor";

export function getSampleVendorData(): VendorFormData {
  return {
    company: {
      legalName: "Nimbus Traders Private Limited",
      tradingName: "Nimbus Foods",
      country: "India",
      registrationNumber: "U74999DL2019PTC123456",
      website: "https://nimbusfoods.in",
      contactEmail: "accounts@nimbusfoods.in",
      contactPhone: "+91 98765 43210",
      businessAddress: "Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana 122001, India",
    },
    banking: {
      accountHolderName: "Nimbus Traders Private Limited",
      bankName: "HDFC Bank",
      accountNumber: "50200012345678",
      swiftCode: "HDFCINBB",
      currency: "INR",
    },
    tax: {
      taxId: "07AAFCN1234M1ZP",
      taxCountry: "India",
    },
    documents: {
      incorporationCert: {
        fileName: "nimbus_incorporation_certificate.pdf",
        fileType: "application/pdf",
      },
      bankProof: {
        fileName: "nimbus_cancelled_cheque.pdf",
        fileType: "application/pdf",
      },
      taxRegistration: {
        fileName: "nimbus_gst_certificate.pdf",
        fileType: "application/pdf",
      },
    },
    commercial: {
      category: "Food & Beverage",
      estimatedAnnualSpend: 4800000,
    },
  };
}
