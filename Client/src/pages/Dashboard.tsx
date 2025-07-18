import LeaseList from '../pages/LeaseList.js';
import LeaseSummaryCard from '../components/LeaseSummaryCard.js';
import Spinner from '../components/Spinner.js';
import { useLeaseStore } from '../store/useLeaseStore.js';
import { toast } from 'react-hot-toast';

export default function Home() {
  const {
    selectedSummary,
    summaryLoading,
    summaryError,
    fetchLeaseSummary,
  } = useLeaseStore();

  const handleSelectSummary: (leaseId: number) => Promise<void> = async (leaseId: number) => {
    try {
      await fetchLeaseSummary(leaseId);
    } catch (err) {
      console.error('Failed to fetch lease summary:', err);
      toast.error("Failed to fetch lease summary. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6 py-4">
      <LeaseList onSelectSummary={handleSelectSummary} />
      <div className="mt-6">
        {summaryLoading && (
          <div className="flex flex-col justify-center items-center py-8 gap-3">
            <Spinner size={48} color="var(--theme-error)" />
            <span className="text-[var(--theme-light)] font-bold mt-2">
            Loading Summary...
          </span>
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
