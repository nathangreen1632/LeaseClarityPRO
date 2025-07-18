export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-center items-center text-center px-4">
      <h2 className="text-3xl sm:text-6xl font-bold text-[var(--theme-error)] mb-2">404</h2>
      <p className="text-lg sm:text-xl text-[var(--theme-light)] mb-4">Page not found.</p>
      <a
        href="/"
        className="text-[var(--theme-light)] font-bold underline hover:text-[var(--theme-primary)] transition"
      >
        Go Home
      </a>
    </div>
  );
}
