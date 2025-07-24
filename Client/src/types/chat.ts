export interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export interface RenderableMessage extends Message {
  id: string;
}

export interface ChatStore {
  isOpen: boolean;
  toggle: () => void;
  messages: Message[];
  addMessage: (msg: Message) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
  clearMessages: () => void;
}
