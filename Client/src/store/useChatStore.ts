import { create } from 'zustand';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatStore {
  isOpen: boolean;
  toggle: () => void;
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  loading: boolean;
  setLoading: (state: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  toggle: (): void =>
    set((state) => {
      if (state.isOpen) {
        return { isOpen: false, messages: [] };
      }
      return { isOpen: true };
    }),
  messages: [],
  addMessage: (msg: Message): void =>
    set((state: ChatStore): {messages: Message[]} => ({ messages: [...state.messages, msg] })),
  clearMessages: (): void => set({ messages: [] }),
  loading: false,
  setLoading: (loading: boolean): void => set({ loading }),
}));
