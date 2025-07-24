import { readFile } from 'fs/promises';
import path from 'path';
import { getJurisdictionSlug } from '../utils/stateJurisdiction.js';

interface NoticeToEnterRule {
  minimumNotice: string;
  exceptions: string[];
}

interface LateFeesRule {
  maxAllowed?: string;
  gracePeriod?: string;
  mustBeReasonable?: boolean;
  notDefinedInStatute?: boolean;
}

interface StateRightsRules {
  noticeToEnter?: NoticeToEnterRule;
  lateFees?: LateFeesRule;
  [key: string]: any;
}

interface TenantRightsBill {
  title: string;
  link: string;
  updated: string;
}

export const analyzeLeaseByState = async (leaseText: string, state: string): Promise<string[]> => {
  const rulesPath: string = path.resolve(__dirname, '../config/rightsRules.json');
  let rules: Record<string, StateRightsRules>;

  try {
    const file: string = await readFile(rulesPath, 'utf-8');
    rules = JSON.parse(file);
  } catch (err) {
    console.error('Failed to load tenant rights rules:', err);
    return ['⚠️ Unable to load tenant rights rules at this time.'];
  }

  const stateRules: StateRightsRules = rules[state];
  const results: string[] = [];

  if (!stateRules) {
    results.push(`⚠️ No rights data available for ${state}.`);
    return results;
  }

  if (stateRules.noticeToEnter) {
    const pattern = /landlord.*enter.*without.*notice/i;
    if (pattern.test(leaseText)) {
      results.push(`❌ Entry without notice violates ${stateRules.noticeToEnter.minimumNotice} rule.`);
    }
  }

  if (stateRules.lateFees?.maxAllowed) {
    const pattern = /late fee.*(more than|exceed|over)/i;
    if (pattern.test(leaseText)) {
      results.push(`⚠️ Late fee clause may exceed ${stateRules.lateFees.maxAllowed} limit.`);
    }
  }

  return results;
};

export const fetchOpenStatesBills: (state: string) => Promise<TenantRightsBill[]> = async (state: string): Promise<TenantRightsBill[]> => {
  const apiKey = process.env.OPENSTATES_API_KEY;

  const jurisdiction: string = getJurisdictionSlug(state);
  if (!jurisdiction) {
    console.warn(`[OpenStates] Unsupported state code: ${state}`);
    return [];
  }

  const url = `https://v3.openstates.org/bills?jurisdiction=${encodeURIComponent(
    jurisdiction
  )}&q=tenant%20rights&sort=updated_desc`;


  try {
    const res: Response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey ?? '',
      },
    });

    if (!res.ok) {
      const errorBody: string = await res.text();
      console.error(`[OpenStates] Failed to fetch bills: ${res.status} ${res.statusText}`);
      console.error(`[OpenStates] Response body: ${errorBody}`);
      return [];
    }

    if (!res.ok) {
      console.error(`[OpenStates] Failed to fetch bills: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any = await res.json();

    return data.results
      .map((bill: any) => {
        const url: any = bill.sources?.[0]?.url;
        return {
          title: bill.title,
          link: typeof url === 'string' && url.startsWith('http') ? url : null,
          updated: bill.updated_at,
        };
      })
      .filter((bill: TenantRightsBill) => bill.link !== null);

  } catch (err) {
    console.error(`[OpenStates] Error fetching bills:`, err);
    return [];
  }
};
