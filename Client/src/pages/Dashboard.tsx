import LeaseList from '../pages/LeaseList.js';
import LeaseSummaryCard from '../components/LeaseSummaryCard.js';
import { useLeaseStore } from '../store/useLeaseStore.js';

export default function Home() {
  const {
    selectedSummary,
    summaryLoading,
    summaryError,
    fetchLeaseSummary,
  } = useLeaseStore();

  // When user clicks "Summary" in LeaseList:
  const handleSelectSummary = (leaseId: number) => {
    fetchLeaseSummary(leaseId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 py-4">
      <LeaseList onSelectSummary={handleSelectSummary} />
      <div className="mt-6">
        {summaryLoading && (
          <div className="flex justify-center items-center">
            <span className="text-[var(--theme-primary)] font-bold">Loading summary...</span>
          </div>
        )}
        {summaryError && (
          <LeaseSummaryCard error={summaryError} summary={null} />
        )}
        {selectedSummary && !summaryLoading && !summaryError && (
          <LeaseSummaryCard summary={selectedSummary} />
        )}
      </div>
    </div>
  );
}
