export interface NoticeToEnterRule {
  minimumNotice: string;
  exceptions: string[];
}

export interface LateFeesRule {
  maxAllowed?: string;
  gracePeriod?: string;
  mustBeReasonable?: boolean;
  notDefinedInStatute?: boolean;
}

export interface StateRightsRules {
  noticeToEnter?: NoticeToEnterRule;
  lateFees?: LateFeesRule;
  [key: string]: any; // For future expansions like habitability, retaliation, etc.
}

export interface TenantRightsBill {
  title: string;
  link: string;
  updated: string;
}

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface TenantRightsConcern {
  category: string;
  issue: string;
  severity?: SeverityLevel;
  sourceClause?: string;
  recommendation?: string;
}

export interface TenantRightsAnalysis {
  state: string;
  analysis: TenantRightsConcern[];
  bills: TenantRightsBill[];
}
