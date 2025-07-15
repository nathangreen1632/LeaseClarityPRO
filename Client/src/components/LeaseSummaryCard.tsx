export interface LeaseSummary {
  rent: string;
  leaseStartDate: string;
  leaseEndDate: string;
  securityDeposit: string;
  noticePeriod: string;
  lateFees: string;
  petPolicy: string;
  [key: string]: string; // allow extra fields
}

interface LeaseSummaryCardProps {
  summary: LeaseSummary | null;
  error?: string;
}

const FIELDS = [
  { key: 'rent', label: 'Monthly Rent' },
  { key: 'leaseStartDate', label: 'Lease Start Date' },
  { key: 'leaseEndDate', label: 'Lease End Date' },
  { key: 'securityDeposit', label: 'Security Deposit' },
  { key: 'noticePeriod', label: 'Notice Period' },
  { key: 'lateFees', label: 'Late Fees' },
  { key: 'petPolicy', label: 'Pet Policy' },
];

export default function LeaseSummaryCard({ summary, error }: Readonly<LeaseSummaryCardProps>) {
  if (error) {
    return (
      <div className="bg-[var(--theme-error)] text-white rounded-2xl p-4 shadow-md my-2 w-full text-center font-bold">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center text-[var(--theme-outline)] py-4">
        No summary available.
      </div>
    );
  }

  // Gather any extra fields not in the standard FIELDS list
  const extraFields = Object.keys(summary).filter(
    key => !FIELDS.some(f => f.key === key)
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full border-2 border-[var(--theme-outline)] mb-3">
      <h2 className="text-xl font-extrabold text-[var(--theme-primary)] mb-4 text-center">Lease Summary</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {FIELDS.map(({ key, label }) => [
          <dt key={`${key}-dt`} className="font-semibold text-[var(--theme-outline)]">{label}</dt>,
          <dd key={`${key}-dd`} className="mb-2">
            {summary[key] ? (
              <span className="text-[var(--theme-primary)] font-bold">{summary[key]}</span>
            ) : (
              <span className="text-[var(--theme-error)] italic">Not found</span>
            )}
          </dd>
        ])}
      </dl>



      {extraFields.length > 0 && (
        <div className="mt-6 bg-[var(--theme-card)] rounded-xl p-3 border border-[var(--theme-accent)]">
          <div className="font-bold text-[var(--theme-primary)] mb-1">Raw Summary Fields</div>
          <pre className="text-xs overflow-x-auto text-[var(--theme-outline)]">
            {JSON.stringify(
              Object.fromEntries(
                extraFields.map(key => [key, summary[key]])
              ),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
