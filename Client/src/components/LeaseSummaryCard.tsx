import React from "react";

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
  trashRemovalFee?: number;
  trashAdminFee?: number;

  // NEWLY ADDED FIELDS
  propertyName?: string;
  unitNumber?: string;
  garageIncluded?: string;
  applicationDate?: string;
  possessionDate?: string;
  concessionAmount?: string;
  utilitiesAdminFee?: string;
  garageFee?: string;
  storageFee?: string;
  rekeyFee?: string;
  pestControlFee?: string;
  filterFee?: string;
  legalNoticeAddress?: string;
  militaryClauseAcknowledged?: string;
  criminalBackgroundAcknowledged?: string;
  packageServiceFee?: string;
  valetTrashFee?: string;
  internetProvided?: string;
  signedElectronically?: boolean;
  leaseVersion?: string;

  [key: string]: any;
}


interface LeaseSummaryCardProps {
  summary: LeaseSummary | null;
  error?: string;
  leaseFileName?: string | null;
}

const CURRENCY_FIELDS: string[] = [
  'rent', 'securityDeposit', 'animalDeposit', 'petRent',
  'petViolationFee', 'returnedCheckFee', 'applicationFee', 'adminFee',
  'expediteFee', 'amendmentFee', 'hoaFee', 'evaluationFee', 'initial',
  'daily', 'trashRemovalFee', 'trashAdminFee', 'insuranceMinimum',
  'concessionAmount', 'utilitiesAdminFee', 'garageFee', 'storageFee',
  'rekeyFee', 'pestControlFee', 'filterFee', 'packageServiceFee', 'valetTrashFee'
];

function formatCurrency(value: any): any {
  if (value == null || value === '') return '';
  let num: any = typeof value === 'string' ? value.replace(/[$,]/g, '') : value;
  let parsed: number = Number(num);
  if (isNaN(parsed)) return value;
  return parsed.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

const FIELDS: {key: string; label: string}[] = [
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
  { key: 'petViolationFee', label: 'Pet Violation Fee' },
  { key: 'requiredInsurance', label: 'Renter’s Insurance Required' },
  { key: 'insuranceMinimum', label: 'Insurance Minimum Coverage' },
  { key: 'utilitiesTenant', label: 'Utilities Paid by Tenant' },
  { key: 'utilitiesLandlord', label: 'Utilities Paid by Landlord' },
  { key: 'trashRemovalFee', label: 'Trash Removal Fee' },
  { key: 'trashAdminFee', label: 'Trash Admin Fee' },
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
  { key: 'cashPaymentAllowed', label: 'Cash Payment Allowed' },
  { key: 'propertyName', label: 'Property Name' },
  { key: 'unitNumber', label: 'Unit Number' },
  { key: 'garageIncluded', label: 'Garage Included' },
  { key: 'applicationDate', label: 'Application Date' },
  { key: 'possessionDate', label: 'Possession Date' },
  { key: 'concessionAmount', label: 'Concession Amount' },
  { key: 'utilitiesAdminFee', label: 'Utilities Admin Fee' },
  { key: 'garageFee', label: 'Garage Fee' },
  { key: 'storageFee', label: 'Storage Fee' },
  { key: 'rekeyFee', label: 'Rekey Fee' },
  { key: 'pestControlFee', label: 'Pest Control Fee' },
  { key: 'filterFee', label: 'Filter Fee' },
  { key: 'legalNoticeAddress', label: 'Legal Notice Address' },
  { key: 'militaryClauseAcknowledged', label: 'Military Clause Acknowledged' },
  { key: 'criminalBackgroundAcknowledged', label: 'Criminal Background Acknowledged' },
  { key: 'packageServiceFee', label: 'Package Service Fee' },
  { key: 'valetTrashFee', label: 'Valet Trash Fee' },
  { key: 'internetProvided', label: 'Internet Provided' },
  { key: 'signedElectronically', label: 'Signed Electronically' },
  { key: 'leaseVersion', label: 'Lease Version' },

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
  'Trash Removal Fee': 'trashRemovalFee',
  'Trash Admin Fee': 'trashAdminFee',
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
  'Cash Payment Allowed': 'cashPaymentAllowed',
  'Property Name': 'propertyName',
  'Unit Number': 'unitNumber',
  'Garage Included': 'garageIncluded',
  'Application Date': 'applicationDate',
  'Possession Date': 'possessionDate',
  'Concession Amount': 'concessionAmount',
  'Utilities Admin Fee': 'utilitiesAdminFee',
  'Garage Fee': 'garageFee',
  'Storage Fee': 'storageFee',
  'Rekey Fee': 'rekeyFee',
  'Pest Control Fee': 'pestControlFee',
  'Filter Fee': 'filterFee',
  'Legal Notice Address': 'legalNoticeAddress',
  'Military Clause Acknowledged': 'militaryClauseAcknowledged',
  'Criminal Background Acknowledged': 'criminalBackgroundAcknowledged',
  'Package Service Fee': 'packageServiceFee',
  'Valet Trash Fee': 'valetTrashFee',
  'Internet Provided': 'internetProvided',
  'Signed Electronically': 'signedElectronically',
  'Lease Version': 'leaseVersion',

};

const BUBBLE_UP_FIELDS: { parent: string; child: string; to: string }[] = [
  { parent: 'petPolicy', child: 'Pet Violation Fee', to: 'petViolationFee' },
  { parent: 'lateFees', child: 'Initial Fee', to: 'lateFeeInitial' },
  { parent: 'lateFees', child: 'Daily Fee', to: 'lateFeeDaily' },
  { parent: 'animalAgreement', child: 'Animal Deposit', to: 'animalDeposit' },
  { parent: 'animalAgreement', child: 'Pet Rent', to: 'petRent' },
  { parent: 'animalAgreement', child: 'Pet Violation Fee', to: 'petViolationFee' },
  { parent: 'utilitiesTenant', child: 'Utilities Paid by Tenant', to: 'utilitiesTenant' },
  { parent: 'utilitiesLandlord', child: 'Utilities Paid by Landlord', to: 'utilitiesLandlord' },
  { parent: 'vehicles', child: 'Vehicles Allowed', to: 'vehicles' },
  { parent: 'animalAgreement', child: 'Animals Allowed', to: 'animalAgreement' },
  { parent: 'trashRemovalFee', child: 'Trash Removal Fee', to: 'trashRemovalFee' },
  { parent: 'trashAdminFee', child: 'Trash Admin Fee', to: 'trashAdminFee' }
];

function normalizeSummary(rawSummary: Record<string, unknown>): LeaseSummary {
  const normalized: LeaseSummary = {} as LeaseSummary;
  for (const [rawKey, value] of Object.entries(rawSummary)) {
    const mappedKey: string = SUMMARY_KEY_MAP[rawKey] || rawKey;
    normalized[mappedKey] = value;
  }
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

function renderObjectField(obj: any, parentKey = ''): React.ReactNode {
  if (!obj) return null;

  if (Array.isArray(obj)) {
    return (
      <ul className="list-disc text-slate-200 ml-4">
        {obj.map((entry: any, idx: number) => {
          let key: string = `${parentKey}-idx-${idx}`;
          if (entry && typeof entry === 'object') {
            const firstProp: unknown = Object.values(entry)[0];
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

  if (typeof obj === "object") {
    return (
      <ul className="list-disc text-[var(--theme-light)] ml-4">
        {Object.entries(obj).map(([k, v]: [string, unknown], idx: number) => {
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
              <span className="font-semibold text-[var(--theme-light)]">
                {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
              </span>{" "}
              <span>{valueContent}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return <span>{String(obj)}</span>;
}

export default function LeaseSummaryCard({ summary, error, leaseFileName }: Readonly<LeaseSummaryCardProps>) {
  if (error) {
    return (
      <div className="bg-[var(--theme-error)] text-slate-200 rounded-2xl p-4 shadow-md my-2 w-full text-center font-bold">
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

  const normalizedSummary: LeaseSummary = normalizeSummary(summary);

  const extraFields: string[] = Object.keys(normalizedSummary).filter(
    key => !FIELDS.some(f => f.key === key)
  );

  return (
    <div className="bg-[var(--theme-dark)] rounded-2xl shadow-md p-4 sm:p-6 w-full border-2 border-red-500 mb-3">
      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 text-center underline">
        Lease Summary
      </h2>
      {leaseFileName && (
        <div className="text-xs text-slate-300 text-center mb-3">
          {leaseFileName}
        </div>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3">
        {FIELDS.map(({ key, label }) => {
          let value = normalizedSummary[key];

          let content: React.ReactNode;
          if (!value) {
            content = <span className="text-red-500 italic font-extrabold text-lg sm:text-xl">Not found</span>;
          } else if (typeof value === 'object') {
            content = renderObjectField(value);
          } else if (CURRENCY_FIELDS.includes(key)) {
            content = <span className="text-slate-200 font-bold">{formatCurrency(value)}</span>;
          } else {
            content = <span className="text-slate-200 font-bold">{value}</span>;
          }

          return (
            <React.Fragment key={key}>
              <dt className="font-semibold text-slate-200">{label}</dt>
              <dd className="mb-2">{content}</dd>
            </React.Fragment>
          );
        })}
      </dl>

      {extraFields.length > 0 && (
        <div className="mt-6 bg-[var(--theme-base)] rounded-xl p-3 border border-[var(--theme-accent)]">
          <div className="font-bold text-[var(--theme-light)] mb-1">Raw Summary Fields</div>
          <pre className="text-xs overflow-x-auto text-[var(--theme-light)]">
          {JSON.stringify(
            Object.fromEntries(
              extraFields.map(key => [
                key,
                CURRENCY_FIELDS.includes(key)
                  ? formatCurrency(normalizedSummary[key])
                  : normalizedSummary[key]
              ])
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
