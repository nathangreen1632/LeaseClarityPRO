import type {ReactNode} from 'react';

export default function PageContainer({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--theme-base)] px-4 py-4 flex flex-col items-center">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl bg-white rounded-2xl shadow-md border-2 border-[var(--theme-outline)]">
        {children}
      </div>
    </div>
  );
}
