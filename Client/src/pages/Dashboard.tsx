import { useEffect } from 'react';
import LeaseList from '../pages/LeaseList.js';
import LeaseSummaryCard from '../components/LeaseSummaryCard.js';
import Spinner from '../components/Spinner.js';
import { useLeaseStore } from '../store/useLeaseStore.js';
import { toast } from 'react-hot-toast';
import LeaseQuickLookModal from '../components/LeaseQuickLookModal.js';

export default function Home() {
  const {
    selectedSummary,
    summaryLoading,
    summaryError,
    fetchLeaseSummary,
    quickLookOpen,
    quickLookLeaseId,
    quickLookSummary,
    quickLookLoading,
    quickLookError,
    fetchQuickLookSummary,
    closeQuickLook,
    leaseFileName,
  } = useLeaseStore();

  const handleSelectSummary: (leaseId: number) => Promise<void> = async (leaseId: number): Promise<void> => {
    try {
      await fetchLeaseSummary(leaseId);
    } catch (err) {
      console.error('Failed to fetch lease summary:', err);
      toast.error("Failed to fetch lease summary. Please try again.");
    }
  };

  useEffect((): () => void => {
    return (): void => {
      useLeaseStore.getState().clearLeaseSummary();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-4">
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

      <LeaseQuickLookModal
        leaseId={quickLookLeaseId}
        open={quickLookOpen}
        onClose={closeQuickLook}
        fetchSummary={fetchQuickLookSummary}
        summary={quickLookSummary}
        loading={quickLookLoading}
        error={quickLookError}
        leaseFileName={leaseFileName ?? ''}
      />
    </div>
  );
}
