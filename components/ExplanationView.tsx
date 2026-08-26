import type { Explanation } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  current: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  outdated: "border-zinc-400/30 bg-zinc-400/10 text-zinc-400",
  ironic: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-300",
  offensive: "border-red-400/40 bg-red-400/10 text-red-300",
  "context-dependent": "border-amber-400/40 bg-amber-400/10 text-amber-300",
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <p className="section-label mb-2">{label}</p>
      <div className="text-sm leading-relaxed text-zinc-300">{children}</div>
    </div>
  );
}

interface ExplanationViewProps {
  explanation: Explanation;
  onSearch: (term: string) => void;
}

export default function ExplanationView({ explanation, onSearch }: ExplanationViewProps) {
  const statusStyle = STATUS_STYLES[explanation.status] ?? STATUS_STYLES["context-dependent"];

  return (
    <article key={explanation.term} className="fade-up space-y-4">
      <div className="card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold text-zinc-100 md:text-3xl">
            {explanation.term}
          </h2>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            {explanation.category}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest ${statusStyle}`}
          >
            {explanation.status}
          </span>
        </div>

        {explanation.summary && (
          <p className="mt-5 border-l-2 border-cyan-400/50 pl-4 text-base leading-relaxed text-zinc-200 md:text-lg">
            {explanation.summary}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section label="what it means">{explanation.meaning || "—"}</Section>
        <Section label="where it came from">{explanation.origin || "—"}</Section>
        <Section label="why it blew up">{explanation.popularity || "—"}</Section>
        <Section label="how people use it">{explanation.usage || "—"}</Section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section label="tone & vibe">{explanation.tone || "—"}</Section>
        <Section label="status notes">{explanation.statusNote || "—"}</Section>
      </div>

      {explanation.examples.length > 0 && (
        <div className="card p-6">
          <p className="section-label mb-4">example usage</p>
          <ul className="space-y-3">
            {explanation.examples.map((example, index) => (
              <li
                key={`${index}-${example.text.slice(0, 16)}`}
                className="rounded-lg border border-white/[0.06] bg-black/30 px-4 py-3"
              >
                <p className="font-mono text-sm text-cyan-100">
                  <span className="mr-2 text-zinc-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {`"${example.text}"`}
                </p>
                {example.context && (
                  <p className="mt-1.5 pl-7 text-xs leading-relaxed text-zinc-500">
                    {example.context}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {explanation.related.length > 0 && (
        <div className="card p-6">
          <p className="section-label mb-4">related rabbit holes</p>
          <div className="flex flex-wrap gap-2">
            {explanation.related.map((term) => (
              <button key={term} type="button" className="chip" onClick={() => onSearch(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
