import { create } from 'zustand';
import type { TenantRightsConcern, TenantRightsBill } from '../types/rights';

interface TenantRightsState {
  analysis: TenantRightsConcern[];
  bills: TenantRightsBill[];
  setAnalysis: (data: TenantRightsConcern[]) => void;
  setBills: (data: TenantRightsBill[]) => void;
}

export const useRightsStore = create<TenantRightsState>((set) => ({
  analysis: [],
  bills: [],
  setAnalysis: (analysis) => set({ analysis }),
  setBills: (bills) => set({ bills }),
}));
