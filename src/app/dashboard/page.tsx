"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useVendorStore } from "@/lib/store";
import { evaluateVendorSubmission, getEffectiveStatus } from "@/lib/rulesEngine";
import { generateVendorMessage } from "@/lib/draftMessage";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SubmissionsTable, type SubmissionRow } from "@/components/dashboard/SubmissionsTable";
import { SubmissionDrawer } from "@/components/dashboard/SubmissionDrawer";
import { DraftMessageModal } from "@/components/dashboard/DraftMessageModal";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import type { SubmissionStatus, VendorSubmission } from "@/types/vendor";

export default function VendorDashboardPage() {
  const submissions = useVendorStore((s) => s.submissions);
  const loadDemoScenarios = useVendorStore((s) => s.loadDemoScenarios);

  // `persist` is undefined during SSR (zustand only attaches it once `window` exists),
  // so every accessor here must tolerate that; getServerSnapshot always reports
  // unhydrated, matching the server render and avoiding a hydration mismatch.
  const hydrated = useSyncExternalStore(
    (cb) => useVendorStore.persist?.onFinishHydration(cb) ?? (() => {}),
    () => useVendorStore.persist?.hasHydrated() ?? false,
    () => false
  );
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);

  // Look up the selected submission by id (rather than holding the object itself) so the
  // drawer stays in sync when a manual approve/reject override mutates the store.
  const selectedSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedId) ?? null,
    [submissions, selectedId]
  );

  function handleLoadDemo() {
    loadDemoScenarios();
    toast.success("Loaded 5 demo scenarios");
  }

  // Run the rules engine once per submission so the table badge and the drawer agree.
  // A manual reviewer override (if set) takes precedence over the computed status.
  const rows = useMemo<SubmissionRow[]>(
    () =>
      submissions.map((submission) => ({
        submission,
        status: getEffectiveStatus(submission),
      })),
    [submissions]
  );

  const counts = useMemo(() => {
    const c = { total: rows.length, approved: 0, pending: 0, rejected: 0 };
    for (const r of rows) {
      if (r.status === "approved") c.approved++;
      else if (r.status === "pending") c.pending++;
      else c.rejected++;
    }
    return c;
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const { legalName, tradingName } = r.submission.company;
      return (
        legalName.toLowerCase().includes(q) ||
        tradingName.toLowerCase().includes(q) ||
        r.submission.id.toLowerCase().includes(q)
      );
    });
  }, [rows, statusFilter, search]);

  function handleCommunicate(submission: VendorSubmission) {
    const result = evaluateVendorSubmission(submission);
    const message = generateVendorMessage(submission, result);
    setDraftMessage(message);
    toast.success("Message drafted");
  }

  return (
    <div className="flex flex-col min-h-full pb-10">
      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
        onLoadDemo={handleLoadDemo}
      />

      {!hydrated ? (
        <DashboardSkeleton />
      ) : (
        <div className="px-6 pt-6 pb-4 space-y-6">
          <StatsOverview counts={counts} />
          <SubmissionsTable
            rows={filteredRows}
            onRowClick={(submission) => setSelectedId(submission.id)}
            onLoadDemo={handleLoadDemo}
          />
        </div>
      )}

      <SubmissionDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedId(null)}
        onCommunicate={handleCommunicate}
      />

      <DraftMessageModal message={draftMessage} onClose={() => setDraftMessage(null)} />
    </div>
  );
}
