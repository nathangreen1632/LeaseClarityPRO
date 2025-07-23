import { useEffect, useState } from 'react';
import { useRightsStore } from '../store/useRightsStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLeaseStore } from '../store/useLeaseStore';
import TenantRightsPanel from '../components/TenantRightsPanel';
import type { TenantRightsAnalysis, TenantRightsConcern } from '../types/rights';
import Spinner from "../components/Spinner";

function LeaseReview() {
  const { analysis, setAnalysis, setBills, clearRightsAnalysis } = useRightsStore();
  const {
    leases,
    fetchLeases,
    clearLeaseSummary,
  } = useLeaseStore();

  const { token } = useAuthStore();
  const [selectedLeaseId, setSelectedLeaseId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchLeases();
  }, [fetchLeases]);

  useEffect(() => {
    const fetchRightsData = async () => {
      const state = localStorage.getItem('userState') ?? 'TX';
      const lease = leases.find((l) => l.id === selectedLeaseId);
      if (!lease || !token) return;

      setLoading(true);
      clearLeaseSummary();
      clearRightsAnalysis();

      try {
        const res = await fetch('/api/rights/analyze-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ leaseId: lease.id, state }),
        });

        if (!res.ok) {
          console.warn(`❌ Failed to fetch AI analysis: HTTP ${res.status}`);
          return;
        }

        const data: TenantRightsAnalysis = await res.json();

        const isValidConcern = (item: any): item is TenantRightsConcern =>
          typeof item === 'object' &&
          typeof item.category === 'string' &&
          typeof item.issue === 'string';

        if (
          !data ||
          !Array.isArray(data.analysis) ||
          data.analysis.some((item) => !isValidConcern(item))
        ) {
          console.warn('❌ Invalid analysis structure received from API:', data);
          return;
        }

        setAnalysis(data.analysis);
        setBills(Array.isArray(data.bills) ? data.bills : []);
      } catch (err) {
        console.error('🔥 AI analysis request failed:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedLeaseId !== '') {
      void fetchRightsData();
    }
  }, [selectedLeaseId, leases, token, setAnalysis, setBills, clearLeaseSummary]);

  useEffect(() => {
    return () => {
      clearRightsAnalysis();
    };
  }, []);


  return (
    <div className="p-6 text-red-500 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lease Legal Review</h1>

      <label htmlFor="leaseSelect" className="block mb-2 text-sm text-gray-400">
        Choose a lease:
      </label>
      <select
        id="leaseSelect"
        className="mb-6 bg-[var(--theme-base)] text-white p-2 rounded w-full"
        value={selectedLeaseId}
        onChange={(e) => setSelectedLeaseId(Number(e.target.value))}
      >
        <option className="text-red-500" value="" disabled>
          Select a lease...
        </option>
        {leases.map((lease) => (
          <option key={lease.id} value={lease.id}>
            {lease.originalFileName}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="flex flex-col items-center gap-3 text-gray-300">
          <Spinner size={36} color="#ef4444" />
          <p>Analyzing your lease... This may take a few moments.</p>
        </div>
      ) : (
        analysis.length > 0 && (
          <TenantRightsPanel state={localStorage.getItem('userState') ?? 'TX'} />
        )
      )}

    </div>
  );
}

export default LeaseReview;
