export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id="nav-glyph" x1="20" y1="14" x2="44" y2="46">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <path
              d="M20 14v28h24"
              stroke="url(#nav-glyph)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="46" cy="46" r="4" fill="#e879f9" />
          </svg>
          <span
            className="glitch font-mono text-sm font-bold tracking-[0.35em] text-zinc-100"
            data-text="LAIN"
          >
            LAIN
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] tracking-[0.25em] text-zinc-500 sm:inline">
            INTERNET CULTURE DECODER
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            <span className="pulse-dot" />
            online
          </span>
        </div>
      </div>
    </header>
  );
}
