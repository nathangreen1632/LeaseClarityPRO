import React, { useEffect } from 'react';
import { useLeaseStore } from '../store/useLeaseStore';

interface LeaseListProps {
  onSelectSummary: (leaseId: number) => void;
}

function formatPrettyDate(date: string | number | Date | null | undefined): string {
  if (!date) return "Unknown";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const LeaseList: React.FC<LeaseListProps> = ({ onSelectSummary }: LeaseListProps) => {
  const { leases, loading, error, fetchLeases, removeLease } = useLeaseStore();

  useEffect(() => {
    async function loadLeases() {
      await fetchLeases();
    }
    void loadLeases();

  }, []);

  async function handleDownload(leaseId: number, originalFileName: string): Promise<void> {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to download files.');
      return;
    }

    try {
      const response = await fetch(`/api/lease/${leaseId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert('Failed to download lease.');
        return;
      }

      const blob: Blob = await response.blob();
      const url: string = window.URL.createObjectURL(blob);

      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url;
      a.download = originalFileName || `lease-${leaseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Download error:', err);
      alert('An error occurred while downloading the file.');
    }
  }

  return (
    <section className="w-full mt-6">
      <h2 className="text-3xl text-center font-bold text-[var(--theme-error)] mb-2">Your Leases</h2>

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
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[var{--theme-dark)] border-2 border-[var(--theme-light)] rounded-xl px-1 py-3 shadow-sm transition-all"
          >
            <div>
              <span className="font-semibold text-[var(--theme-light)] break-all">
                {lease.originalFileName}
              </span>
              <div className="text-xs text-[var(--theme-secondary)]">
                Uploaded: {formatPrettyDate(lease.uploadedAt)}
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
              <button
                className="bg-[var(--theme-info)] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[var(--theme-success)] hover:text-white transition-colors"
                onClick={() => handleDownload(lease.id, lease.originalFileName)}
                disabled={loading}
                aria-label="Download lease"
              >
                Download
              </button>
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
