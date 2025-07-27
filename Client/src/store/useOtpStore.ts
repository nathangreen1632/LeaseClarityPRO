import { create } from 'zustand';

interface OtpStore {
  isOpen: boolean;
  email: string;
  step: 'enterEmail' | 'verifyOtp' | 'setPassword';
  tempOtpToken: string | null;
  openModal: () => void;
  closeModal: () => void;
  setEmail: (email: string) => void;
  setStep: (step: OtpStore['step']) => void;

  // 📱 For future Twilio usage
  // phone: string;
  // setPhone: (phone: string) => void;
}

export const useOtpStore = create<OtpStore>((set) => ({
  isOpen: false,
  email: '',
  step: 'enterEmail',
  tempOtpToken: null,

  openModal: (): void =>
    set({
      isOpen: true,
      step: 'enterEmail',
      email: '',
      tempOtpToken: null,
      // phone: '',
    }),

  closeModal: (): void =>
    set({
      isOpen: false,
      step: 'enterEmail',
      email: '',
      tempOtpToken: null,
      // phone: '',
    }),

  setEmail: (email: string): void => set({ email }),

  setStep: (step) => set({ step }),

  // setPhone: (phone) => set({ phone }),
}));
