import React from "react";

// Expanded LeaseSummary interface with new fields.
export interface LeaseSummary {
  rent: string;
  leaseStartDate: string;
  leaseEndDate: string;
  securityDeposit: string;
  noticePeriod: string;
  lateFees: string | Record<string, any>;
  petPolicy: string | Record<string, any>;
  leaseTermMonths?: string;
  moveInDate?: string;
  tenantNames?: string | string[];
  occupants?: string | string[];
  vehicles?: Record<string, any>[] | string;
  animalAgreement?: Record<string, any>[] | string;
  animalDeposit?: string;
  petRent?: string;
  petViolationFee?: string | Record<string, any>;
  requiredInsurance?: string;
  insuranceMinimum?: string;
  utilitiesTenant?: string | string[];
  utilitiesLandlord?: string | string[];
  returnedCheckFee?: string;
  applicationFee?: string;
  adminFee?: string;
  expediteFee?: string;
  amendmentFee?: string;
  hoaFee?: string;
  noSmoking?: string;
  carpetCleaning?: string;
  quarterlyInspection?: string;
  showingsNotice?: string;
  cashPaymentAllowed?: string;
  [key: string]: any;
}

interface LeaseSummaryCardProps {
  summary: LeaseSummary | null;
  error?: string;
}

// Fields to treat as currency
const CURRENCY_FIELDS = [
  'rent', 'securityDeposit', 'animalDeposit', 'petRent',
  'petViolationFee', 'returnedCheckFee', 'applicationFee', 'adminFee',
  'expediteFee', 'amendmentFee', 'hoaFee', 'evaluationFee', 'initial', 'daily',
];

// Currency formatting helper
function formatCurrency(value: any) {
  if (value == null || value === '') return '';
  let num = typeof value === 'string' ? value.replace(/[$,]/g, '') : value;
  let parsed = Number(num);
  if (isNaN(parsed)) return value;
  return parsed.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

// Main fields
const FIELDS = [
  { key: 'rent', label: 'Monthly Rent' },
  { key: 'leaseStartDate', label: 'Lease Start Date' },
  { key: 'leaseEndDate', label: 'Lease End Date' },
  { key: 'securityDeposit', label: 'Security Deposit' },
  { key: 'noticePeriod', label: 'Notice Period' },
  { key: 'lateFees', label: 'Late Fees' },
  { key: 'petPolicy', label: 'Pet Policy' },
  { key: 'leaseTermMonths', label: 'Lease Term (Months)' },
  { key: 'moveInDate', label: 'Move-in Date' },
  { key: 'tenantNames', label: 'Tenant(s)' },
  { key: 'occupants', label: 'Other Occupants' },
  { key: 'vehicles', label: 'Vehicles Allowed' },
  { key: 'animalAgreement', label: 'Animals Allowed' },
  { key: 'animalDeposit', label: 'Animal Deposit' },
  { key: 'petRent', label: 'Monthly Pet Rent' },
  { key: 'petViolationFee', label: 'Pet Violation Fee' }, // This will now be properly populated!
  { key: 'requiredInsurance', label: 'Renter’s Insurance Required' },
  { key: 'insuranceMinimum', label: 'Insurance Minimum Coverage' },
  { key: 'utilitiesTenant', label: 'Utilities Paid by Tenant' },
  { key: 'utilitiesLandlord', label: 'Utilities Paid by Landlord' },
  { key: 'returnedCheckFee', label: 'Returned Check Fee' },
  { key: 'applicationFee', label: 'Application Fee' },
  { key: 'adminFee', label: 'Admin/Move-in Fee' },
  { key: 'expediteFee', label: 'Expedite Processing Fee' },
  { key: 'amendmentFee', label: 'Amendment Fee' },
  { key: 'hoaFee', label: 'HOA/Community Fee' },
  { key: 'noSmoking', label: 'No Smoking Policy' },
  { key: 'carpetCleaning', label: 'Move-out Carpet Cleaning Required' },
  { key: 'quarterlyInspection', label: 'Quarterly Inspections' },
  { key: 'showingsNotice', label: 'Showings During Final Lease Days' },
  { key: 'cashPaymentAllowed', label: 'Cash Payment Allowed' }
];

const SUMMARY_KEY_MAP: Record<string, string> = {
  'Monthly Rent': 'rent',
  'Lease Start Date': 'leaseStartDate',
  'Lease End Date': 'leaseEndDate',
  'Security Deposit': 'securityDeposit',
  'Notice Period': 'noticePeriod',
  'Late Fees': 'lateFees',
  'Pet Policy': 'petPolicy',
  'Lease Term (Months)': 'leaseTermMonths',
  'Move-in Date': 'moveInDate',
  'Tenant(s)': 'tenantNames',
  'Other Occupants': 'occupants',
  'Vehicles Allowed': 'vehicles',
  'Animals Allowed': 'animalAgreement',
  'Animal Deposit': 'animalDeposit',
  'Monthly Pet Rent': 'petRent',
  'Pet Violation Fee': 'petViolationFee',
  'Renter’s Insurance Required': 'requiredInsurance',
  'Insurance Minimum Coverage': 'insuranceMinimum',
  'Utilities Paid by Tenant': 'utilitiesTenant',
  'Utilities Paid by Landlord': 'utilitiesLandlord',
  'Returned Check Fee': 'returnedCheckFee',
  'Application Fee': 'applicationFee',
  'Admin/Move-in Fee': 'adminFee',
  'Expedite Processing Fee': 'expediteFee',
  'Amendment Fee': 'amendmentFee',
  'HOA/Community Fee': 'hoaFee',
  'No Smoking Policy': 'noSmoking',
  'Move-out Carpet Cleaning Required': 'carpetCleaning',
  'Quarterly Inspections': 'quarterlyInspection',
  'Showings During Final Lease Days': 'showingsNotice',
  'Cash Payment Allowed': 'cashPaymentAllowed'
};

// Step 1: Add bubble-up rules
const BUBBLE_UP_FIELDS = [
  { parent: 'petPolicy', child: 'Pet Violation Fee', to: 'petViolationFee' },
  // Add more here for other fields as needed, e.g. { parent: 'lateFees', child: 'Daily Fee', to: 'lateFeeDaily' }
];

function normalizeSummary(rawSummary: Record<string, unknown>): LeaseSummary {
  const normalized: LeaseSummary = {} as LeaseSummary;
  for (const [rawKey, value] of Object.entries(rawSummary)) {
    const mappedKey: string = SUMMARY_KEY_MAP[rawKey] || rawKey;
    normalized[mappedKey] = value;
  }
  // Bubble up all fields from their parent
  for (const { parent, child, to } of BUBBLE_UP_FIELDS) {
    if (normalized[parent] && typeof normalized[parent] === 'object') {
      const obj = normalized[parent] as Record<string, any>;
      if (obj[child]) {
        normalized[to] = obj[child];
        delete obj[child];
      }
    }
  }
  return normalized;
}

// Renders objects and arrays with currency formatting for nested fields
function renderObjectField(obj: any, parentKey = ''): React.ReactNode {
  if (!obj) return null;

  // Handle arrays
  if (Array.isArray(obj)) {
    return (
      <ul className="list-disc ml-4">
        {obj.map((entry, idx) => {
          let key = `${parentKey}-idx-${idx}`;
          if (entry && typeof entry === 'object') {
            // Try to build a more descriptive key if possible
            const firstProp = Object.values(entry)[0];
            if (firstProp && typeof firstProp === 'string') {
              key += '-' + firstProp.slice(0, 10).replace(/\s/g, '_');
            }
          }
          if (typeof entry === 'object') {
            return <li key={key}>{renderObjectField(entry, key)}</li>;
          }
          return <li key={key}>{String(entry)}</li>;
        })}
      </ul>
    );
  }

  // Handle objects
  if (typeof obj === "object") {
    return (
      <ul className="list-disc ml-4">
        {Object.entries(obj).map(([k, v], idx) => {
          const key = `${parentKey}-${k}-${idx}`;
          let valueContent: React.ReactNode;

          if (typeof v === 'object' && v !== null) {
            valueContent = renderObjectField(v, key);
          } else if (CURRENCY_FIELDS.includes(k)) {
            valueContent = formatCurrency(v);
          } else {
            valueContent = String(v);
          }

          return (
            <li key={key}>
              <span className="font-semibold">
                {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
              </span>{" "}
              <span>{valueContent}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  // Handle primitives
  return <span>{String(obj)}</span>;
}


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

  const normalizedSummary = normalizeSummary(summary);

  const extraFields = Object.keys(normalizedSummary).filter(
    key => !FIELDS.some(f => f.key === key)
  );

  return (
    <div className="bg-slate-200 rounded-2xl shadow-md p-5 w-full border-2 border-[var(--theme-outline)] mb-3">
      <h2 className="text-2xl font-extrabold text-[var(--theme-primary)] mb-4 text-center">Lease Summary</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {FIELDS.map(({ key, label }) => {
          let value = normalizedSummary[key];

          let content: React.ReactNode;
          if (!value) {
            content = <span className="text-[var(--theme-error)] italic">Not found</span>;
          } else if (typeof value === 'object') {
            content = renderObjectField(value);
          } else if (CURRENCY_FIELDS.includes(key)) {
            content = <span className="text-[var(--theme-base)] font-bold">{formatCurrency(value)}</span>;
          } else {
            content = <span className="text-[var(--theme-base)] font-bold">{value}</span>;
          }

          return (
            <React.Fragment key={key}>
              <dt className="font-semibold text-[var(--theme-base)]">{label}</dt>
              <dd className="mb-2">{content}</dd>
            </React.Fragment>
          );
        })}
      </dl>

      {extraFields.length > 0 && (
        <div className="mt-6 bg-[var(--theme-card)] rounded-xl p-3 border border-[var(--theme-accent)]">
          <div className="font-bold text-[var(--theme-primary)] mb-1">Raw Summary Fields</div>
          <pre className="text-xs overflow-x-auto text-[var(--theme-outline)]">
            {JSON.stringify(
              Object.fromEntries(
                extraFields.map(key => [key, normalizedSummary[key]])
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
