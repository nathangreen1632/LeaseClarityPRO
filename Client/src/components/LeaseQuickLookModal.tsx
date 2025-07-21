import React, { useEffect, useRef } from "react";
import Spinner from "./Spinner";
import { useChatStore } from '../store/useChatStore';

interface LeaseQuickLookModalProps {
  leaseId: number | null;
  open: boolean;
  onClose: () => void;
  fetchSummary: (leaseId: number) => Promise<void>;
  summary: string | null;
  loading: boolean;
  error: string | null;
  leaseFileName?: string;
}

function LeaseQuickLookModal(props: Readonly<LeaseQuickLookModalProps>) {
  const {
    leaseId,
    open,
    onClose,
    fetchSummary,
    summary,
    loading,
    error,
    leaseFileName,
  } = props;

  const backdropRef = useRef<HTMLDivElement>(null);
  const { isOpen, toggle } = useChatStore();

  useEffect((): void => {
    if (open && leaseId) {
      void fetchSummary(leaseId);
    }
    // eslint-disable-next-line
  }, [leaseId, open]);

  useEffect((): () => void => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return (): void => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect((): void => {
    if (open && backdropRef.current) {
      backdropRef.current.focus();
    }
  }, [open]);

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  let content: React.ReactNode;
  if (loading) {
    content = (
      <div className="flex flex-col items-center gap-4 py-12">
        <Spinner size={40} color="var(--theme-error)" />
        <span className="text-[var(--theme-light)] font-bold">
          Summarizing lease...
        </span>
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-[var(--theme-error)] text-white rounded-lg p-4 text-center font-bold">
        {error}
      </div>
    );
  } else {
    content = summary ?? <span className="italic">No summary available.</span>;
  }

  return (
    <div
      ref={backdropRef}
      className="fixed z-50 inset-0 bg-black/60 flex items-center justify-center px-2"
      onClick={handleBackdropClick}
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div
        className="relative bg-black max-w-2xl w-full rounded-2xl border-2 border-[var(--theme-primary)] shadow-2xl p-6 text-[var(--theme-light)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lease-quicklook-title"
        aria-describedby="lease-quicklook-content"
        tabIndex={-1}
        onKeyDown={handleBackdropKeyDown}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-3xl font-bold text-[var(--theme-error)] hover:text-[var(--theme-success)] transition"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <h2
          id="lease-quicklook-title"
          className="text-[var(--theme-error)] sm:text-3xl font-extrabold text-center mb-5"
        >
          Lease Quick Look
        </h2>
        {leaseFileName && (
          <div className="text-xs text-slate-300 text-center mb-2">
            {leaseFileName}
          </div>
        )}
        <div
          id="lease-quicklook-content"
          className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-[var(--theme-light)]"
        >
          {content}
        </div>

        <div className="mt-6 border-t border-[var(--theme-primary)] pt-4">
          <div className="flex justify-end">
            <button
              onClick={toggle}
              disabled={loading || !summary}
              className={`font-semibold px-4 py-2 rounded-md mb-3 transition ${
                loading || !summary
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isOpen ? 'Hide Gherin' : 'Ask Gherin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaseQuickLookModal;
