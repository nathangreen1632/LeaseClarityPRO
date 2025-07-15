import PageContainer from '../components/PageContainer';

export default function HomePage() {
  return (
    <PageContainer>
      <header className="text-center py-8">
        <h1 className="text-3xl font-extrabold text-[var(--theme-primary)]">
          Digital Lease Reader
        </h1>
        <p className="mt-2 text-[var(--theme-accent)] font-medium text-base">
          Instantly understand your lease.{' '}
          <span className="font-semibold text-[var(--theme-outline)]">
            Upload. Parse. Know your rights.
          </span>
        </p>
      </header>
      {/* File upload UI and summary coming next */}
      <div className="my-8 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-[var(--theme-accent)] flex items-center justify-center mb-2 shadow-md">
          <span className="text-4xl text-[var(--theme-primary)] font-extrabold">
            PDF
          </span>
        </div>
        <p className="text-[var(--theme-outline)] text-center font-semibold">
          Upload your lease PDF to get started.
        </p>
      </div>
    </PageContainer>
  );
}
