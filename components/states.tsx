export function LoadingState() {
  return (
    <div role="status" aria-live="polite" className="card fade-up space-y-5 p-8">
      <p className="cursor-blink font-mono text-sm text-cyan-300">searching the wired</p>
      <div className="space-y-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.07]" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.05]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.05]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
      </div>
      <p className="font-mono text-xs text-zinc-600">
        this usually takes a few seconds — the AI is thinking about your query
      </p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="fade-up card border-red-500/30 bg-red-500/[0.05] p-8 text-center"
    >
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-red-300">
        error // connection lost
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-400/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-red-200 transition hover:bg-red-400/10"
      >
        retry
      </button>
    </div>
  );
}

const FEATURES = [
  { title: "meaning", desc: "what the term actually says vs. what it implies" },
  { title: "origin", desc: "which platform or community spawned it" },
  { title: "usage", desc: "how people really use it today, with examples" },
  { title: "status", desc: "current, outdated, ironic, risky, or context-dependent" },
];

export function EmptyState() {
  return (
    <div className="card fade-up border-dashed p-10 text-center md:p-12">
      <p className="cursor-blink font-mono text-lg text-zinc-400">awaiting input</p>
      <p className="mt-3 text-sm text-zinc-500">
        Type anything from internet culture above and hit analyze.
      </p>
      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/70">
              {feature.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
