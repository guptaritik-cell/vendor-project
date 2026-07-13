export type SubmissionStatus = "approved" | "pending" | "rejected";

export interface UploadedDocument {
  fileName: string;
  fileType: string;
}

export interface VendorCompany {
  legalName: string;
  tradingName: string;
  country: string;
  registrationNumber: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
}

export interface VendorBanking {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  swiftCode: string;
  currency: string;
}

export interface VendorTax {
  taxId: string;
  taxCountry: string;
}

export interface VendorDocuments {
  incorporationCert: UploadedDocument | null;
  bankProof: UploadedDocument | null;
  taxRegistration: UploadedDocument | null;
}

export interface VendorCommercial {
  category: string;
  estimatedAnnualSpend: number | "";
}

export interface VendorFormData {
  company: VendorCompany;
  banking: VendorBanking;
  tax: VendorTax;
  documents: VendorDocuments;
  commercial: VendorCommercial;
}

export interface VendorSubmission extends VendorFormData {
  id: string;
  status: SubmissionStatus;
  createdAt: string;
  /** Set when a reviewer manually approves/rejects, overriding the rules-engine decision. */
  manualStatus?: SubmissionStatus | null;
  manualStatusAt?: string;
}

export const EMPTY_VENDOR_FORM: VendorFormData = {
  company: {
    legalName: "",
    tradingName: "",
    country: "",
    registrationNumber: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    businessAddress: "",
  },
  banking: {
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    swiftCode: "",
    currency: "",
  },
  tax: {
    taxId: "",
    taxCountry: "",
  },
  documents: {
    incorporationCert: null,
    bankProof: null,
    taxRegistration: null,
  },
  commercial: {
    category: "",
    estimatedAnnualSpend: "",
  },
};
