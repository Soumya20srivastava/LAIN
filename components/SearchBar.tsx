interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function SearchBar({ value, onChange, onSubmit, loading }: SearchBarProps) {
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='try "no cap", "skibidi toilet", "the backrooms"...'
        aria-label="Enter a meme, slang word, phrase, or reference"
        maxLength={200}
        className="w-full flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            decoding
          </>
        ) : (
          "analyze"
        )}
      </button>
    </form>
  );
}
