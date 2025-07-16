import React, { useEffect } from 'react';
import { useLeaseStore } from '../store/useLeaseStore';

interface LeaseListProps {
  onSelectSummary: (leaseId: number) => void;
}

const LeaseList: React.FC<LeaseListProps> = ({ onSelectSummary }) => {
  const { leases, loading, error, fetchLeases, removeLease } = useLeaseStore();

  useEffect(() => {
    fetchLeases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full mt-6">
      <h2 className="text-3xl text-center font-bold text-[var(--theme-light)] mb-2">Your Leases</h2>

      {loading && (
        <div className="py-4 text-[var(--theme-accent)] font-semibold animate-pulse">
          Loading leases…
        </div>
      )}

      {error && (
        <div className="py-2 text-[var(--theme-error)] text-center rounded-lg font-medium">
          {error}
        </div>
      )}

      {!loading && leases.length === 0 && (
        <div className="py-4 text-gray-200 text-center">No leases uploaded yet.</div>
      )}

      <ul className="flex flex-col gap-3">
        {leases.map((lease) => (
          <li
            key={lease.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-200 border-2 border-[var(--theme-outline)] rounded-xl px-1 py-3 shadow-sm transition-all"
          >
            <div>
              <span className="font-semibold text-[var(--theme-outline)] break-all">
                {lease.originalFileName}
              </span>
              <div className="text-xs text-[var(--theme-secondary)]">
                Uploaded: {new Date(lease.uploadedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                className="bg-[var(--theme-primary)] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[var(--theme-success)] hover:text-[var(--theme-light)] transition-colors"
                onClick={() => onSelectSummary(lease.id)}
                disabled={loading}
                aria-label="Show summary"
              >
                Summary
              </button>
              <a
                className="bg-[var(--theme-info)] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[var(--theme-success)] hover:text-white transition-colors"
                href={`/api/lease/${lease.id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download lease"
              >
                Download
              </a>
              <button
                className="bg-[var(--theme-error)] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[var(--theme-error-dark)] hover:text-white transition-colors"
                onClick={() => removeLease(lease.id)}
                disabled={loading}
                aria-label="Delete lease"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LeaseList;
