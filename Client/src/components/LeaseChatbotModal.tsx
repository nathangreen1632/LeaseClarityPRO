import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLeaseStore } from '../store/useLeaseStore';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X } from 'lucide-react';

export default function LeaseChatbotModal() {
  const leaseId: number | null = useLeaseStore((s): number | null => s.quickLookLeaseId);
  const {
    isOpen,
    toggle: toggleChat,
    messages,
    addMessage,
    loading,
    setLoading,
  } = useChatStore();
  const token: string | null = useAuthStore((state): string | null => state.token);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const askQuestion: () => Promise<void> = async (): Promise<void> => {
    if (!input.trim() || leaseId === null) return;
    const question: string = input.trim();
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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? 'Something went wrong');
      }

      const data = await response.json();
      const answer = data.answer ?? 'No answer found.';
      addMessage({ sender: 'bot', text: answer });
    } catch (error: any) {
      addMessage({
        sender: 'bot',
        text: error.message ?? 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (leaseId === null) return null;

  const content = (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg z-[100] focus:outline-none"
        aria-label="Open Lease Chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-[100] w-full max-w-sm h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border">
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <span className="font-semibold text-gray-800">Lease Chat Assistant</span>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
              <X />
            </button>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-white text-sm"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-emerald-100 self-end ml-auto text-right'
                    : 'bg-gray-100 self-start mr-auto text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Thinking...</div>}
          </div>

          <div className="p-3 border-t bg-gray-50 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void askQuestion();
              }}
              disabled={loading}
              className="w-full pr-24 border rounded-md px-3 py-2 text-sm focus:outline-none"
              placeholder="E.g. When is rent due?"
            />
            <button
              onClick={askQuestion}
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm rounded-md disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </>
  );

  const portalRoot = document.getElementById('portal-root');
  return portalRoot ? createPortal(content, portalRoot) : null;
}
