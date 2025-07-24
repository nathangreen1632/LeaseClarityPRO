import { create } from 'zustand';
import type { TenantRightsConcern, TenantRightsBill } from '../types/rights';

interface TenantRightsState {
  analysis: TenantRightsConcern[];
  bills: TenantRightsBill[];
  setAnalysis: (data: TenantRightsConcern[]) => void;
  setBills: (data: TenantRightsBill[]) => void;
  clearRightsAnalysis: () => void;
}

export const useRightsStore = create<TenantRightsState>((set) => ({
  analysis: [],
  bills: [],
  setAnalysis: (analysis: TenantRightsConcern[]): void => set({ analysis }),
  setBills: (bills: TenantRightsBill[]): void => set({ bills }),
  clearRightsAnalysis: (): void => set({ analysis: [], bills: [] }),
}));
