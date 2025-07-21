const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full px-4 py-3 bg-black border-t-2 border-[var(--theme-outline)] flex flex-col items-center justify-center text-center gap-1">
      <span className="text-slate-300 text-sm font-semibold">
        &copy; {currentYear} One Guy Productions
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
        <a
          href="https://www.cvitaepro.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--theme-primary)] transition"
        >
          CVitaePRO
        </a>
        <span className="text-slate-600">|</span>
        <a
          href="https://www.careergistpro.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--theme-primary)] transition"
        >
          CareerGistPRO
        </a>
        <span className="text-slate-600">|</span>
        <a
          href="https://www.pydatapro.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--theme-primary)] transition"
        >
          PyDataPRO
        </a>
      </div>
    </footer>
  );
}
