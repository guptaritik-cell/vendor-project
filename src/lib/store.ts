import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SubmissionStatus, VendorFormData, VendorSubmission } from "@/types/vendor";
import { createDemoSubmissions } from "@/lib/seedData";

function generateSubmissionId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VEN-${stamp}-${rand}`;
}

interface VendorStore {
  submissions: VendorSubmission[];
  addSubmission: (data: VendorFormData) => VendorSubmission;
  getSubmission: (id: string) => VendorSubmission | undefined;
  loadDemoScenarios: () => void;
  /** Manually approve/reject a submission, overriding the rules-engine decision. Pass null to revert to the automatic decision. */
  setManualStatus: (id: string, status: SubmissionStatus | null) => void;
}

export const useVendorStore = create<VendorStore>()(
  persist(
    (set, get) => ({
      submissions: [],

      addSubmission: (data) => {
        const submission: VendorSubmission = {
          ...data,
          id: generateSubmissionId(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ submissions: [submission, ...s.submissions] }));
        return submission;
      },

      getSubmission: (id) => get().submissions.find((s) => s.id === id),

      loadDemoScenarios: () => {
        set((s) => ({ submissions: [...createDemoSubmissions(), ...s.submissions] }));
      },

      setManualStatus: (id, status) => {
        set((s) => ({
          submissions: s.submissions.map((sub) =>
            sub.id === id
              ? { ...sub, manualStatus: status, manualStatusAt: status ? new Date().toISOString() : undefined }
              : sub
          ),
        }));
      },
    }),
    { name: "pop_vendor_submissions" }
  )
);
