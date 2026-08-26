export interface HistoryItem {
  q: string;
  t: number;
}

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryList({ items, onSelect, onClear }: HistoryListProps) {
  return (
    <section aria-label="Recent searches">
      <div className="mb-3 flex items-center justify-between">
        <p className="section-label">recent searches</p>
        <button
          type="button"
          onClick={onClear}
          className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 transition hover:text-red-300"
        >
          clear all
        </button>
      </div>
      <ol className="card divide-y divide-white/[0.04] overflow-hidden">
        {items.map((item, index) => (
          <li key={`${item.t}-${item.q}`}>
            <button
              type="button"
              onClick={() => onSelect(item.q)}
              className="group flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition hover:bg-white/[0.03]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-xs text-cyan-300/50 group-hover:text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-sm text-zinc-300 group-hover:text-cyan-200">
                  {item.q}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-zinc-600">
                {formatDate(item.t)}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-2 font-mono text-[11px] text-zinc-700">
        history lives only in your browser (localStorage)
      </p>
    </section>
  );
}
