import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLeaseStore } from '../store/useLeaseStore';
import {type RefObject, useEffect, useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuid } from 'uuid';
import { MessageCircle, X } from 'lucide-react';

interface RenderableMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function LeaseChatbotModal() {
  const leaseId: number | null = useLeaseStore((s): number | null => s.quickLookLeaseId);
  const quickLookLoading: boolean = useLeaseStore((s): boolean => s.quickLookLoading);
  const quickLookError: string | null = useLeaseStore((s): string | null => s.quickLookError);
  const uploading: boolean = useLeaseStore((s): boolean => s.uploading);
  const clearMessages: () => void = useChatStore((s): () => void => s.clearMessages);

  const {
    isOpen,
    toggle: toggleChat,
    messages,
    addMessage,
    loading,
    setLoading,
  } = useChatStore();

  const token: string | null = useAuthStore((s): string | null => s.token);
  const [input, setInput] = useState('');
  const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const [renderMessages, setRenderMessages] = useState<RenderableMessage[]>([]);
  const [greetedLeaseId, setGreetedLeaseId] = useState<number | null>(null);

  useEffect((): void => {
    if (isOpen && leaseId && leaseId !== greetedLeaseId) {
      addMessage({
        sender: 'bot',
        text: 'Hi, I’m Gherin — your virtual assistant. Ask me anything about your lease!',
      });
      setGreetedLeaseId(leaseId);
    }
  }, [isOpen, leaseId, greetedLeaseId, addMessage]);

  useEffect((): void => {
    if (leaseId === null) {
      clearMessages();
      setGreetedLeaseId(null);
    }
  }, [leaseId, clearMessages]);

  useEffect((): void => {
    if (isOpen && containerRef.current) {
      requestAnimationFrame((): void => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
      });
    }
  }, [isOpen]);

  useEffect((): void => {
    setRenderMessages(
      messages.map((m, index) => ({
        ...m,
        id: `${index}-${m.text.slice(0, 10)}-${uuid()}`,
      }))
    );
  }, [messages]);

  useEffect((): void => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [renderMessages]);

  const askQuestion: () => Promise<void> = async (): Promise<void> => {
    const question: string = input.trim();
    if (!question || leaseId === null) return;

    addMessage({ sender: 'user', text: question });
    setInput('');
    setLoading(true);

    try {
      const response: Response = await fetch(`/api/lease/${leaseId}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ question }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data) {
        const fallbackMessage: any = data?.error ?? 'The server could not answer your question.';
        addMessage({ sender: 'bot', text: fallbackMessage });
        return;
      }

      const answer: any = data.answer ?? 'No answer found.';
      addMessage({ sender: 'bot', text: answer });
    } catch {
      addMessage({
        sender: 'bot',
        text: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (leaseId === null) return null;

  const isDisabled: boolean = loading || quickLookLoading || uploading || !!quickLookError;

  let chatButtonTitle: string = 'Open Lease Chatbot';
  if (quickLookError) {
    chatButtonTitle = 'Lease failed to load';
  } else if (quickLookLoading) {
    chatButtonTitle = 'Loading lease...';
  } else if (uploading) {
    chatButtonTitle = 'Uploading lease...';
  } else if (loading) {
    chatButtonTitle = 'Asking question...';
  }

  const modal = isOpen ? (
    <div
      className="
      fixed
      bottom-0 sm:bottom-20
      left-1/2 sm:left-auto
      right-auto sm:right-6
      z-[100]
      w-full max-w-sm h-[80vh] sm:h-[600px]
      rounded-2xl
      shadow-[0_10px_40px_0_rgba(16,24,40,0.35)]
      border border-gray-200
      bg-gradient-to-br from-white via-gray-50 to-gray-200
      flex flex-col
      transform -translate-x-1/2 sm:translate-x-0
    "
    >
      <div className="flex items-center justify-between p-4 rounded-t-2xl border-b bg-gradient-to-r from-[var(--theme-base)] to-[var(--theme-base)] shadow-inner">
        <span className="font-bold text-[var(--theme-light)] tracking-tight">Gherin</span>
        <button onClick={toggleChat} className="text-gray-400 hover:text-gray-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-300 rounded-b-lg ring-1 ring-inset ring-gray-100 shadow-inner custom-scrollbar"
      >
        {renderMessages.map((msg, index) => {
          let baseClasses: string = 'p-2 rounded-lg shadow max-w-[80%] break-words transition-opacity duration-1000';
          let messageClasses: string = '';

          if (msg.sender === 'user') {
            messageClasses = 'bg-emerald-100 shadow-md border border-emerald-200 self-end ml-auto text-right';
          } else {
            messageClasses = 'bg-white shadow-sm border border-gray-200 self-start mr-auto text-left';
            if (index === 0 && msg.text.startsWith('Hi, I’m Gherin')) {
              messageClasses += ' animate-fade-in';
            }
          }

          return (
            <div key={msg.id} className={`${baseClasses} ${messageClasses}`}>
              {msg.text}
            </div>
          );
        })}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
      </div>

      <div className="p-3 border-t bg-gradient-to-r from-slate-20 to-slate-500 relative shadow-md rounded-b-2xl">
        <input
          value={input}
          onChange={(e): void => setInput(e.target.value)}
          onKeyDown={(e): void => {
            if (e.key === 'Enter') void askQuestion();
          }}
          disabled={loading}
          className="w-full pr-24 border text-[var(--theme-base)] border-black rounded-lg px-3 py-2 text-base sm:text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-inner"
          placeholder="E.g. When is rent due?"
        />
        <button
          onClick={askQuestion}
          disabled={loading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm rounded-lg shadow transition"
        >
          Ask
        </button>
      </div>
    </div>
  ) : null;

  const portalRoot = document.getElementById('portal-root');

  return (
    <>
      <button
        onClick={toggleChat}
        disabled={isDisabled}
        className={`fixed bottom-6 right-6 z-[100] p-4 rounded-full shadow-lg focus:outline-none transition ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
        aria-label="Open Lease Chatbot"
        title={chatButtonTitle}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {portalRoot ? createPortal(modal, portalRoot) : null}
    </>
  );
}
