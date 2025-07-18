import type {ReactNode} from 'react';

export default function PageContainer({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[var(--theme-base)] px-2 py-2 sm:px-4 sm:py-4 flex flex-col items-center">
      <div className="
        w-full
        max-w-md
        sm:max-w-xl
        md:max-w-2xl
        lg:max-w-3xl
        xl:max-w-4xl
        bg-black
        rounded-2xl
        shadow-md
        border-2
        border-[var(--theme-outline)]
        p-3
        sm:p-6
      ">
        {children}
      </div>
    </div>
  );
}
