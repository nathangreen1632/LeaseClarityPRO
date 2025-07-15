export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h2 className="text-3xl font-bold text-[var(--theme-error)] mb-2">404</h2>
      <p className="text-lg text-[var(--theme-outline)] mb-4">Page not found.</p>
      <a
        href="/"
        className="text-[var(--theme-primary)] font-bold underline hover:text-[var(--theme-accent)]"
      >
        Go Home
      </a>
    </div>
  );
}
