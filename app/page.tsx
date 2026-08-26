"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Explanation } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import ExampleChips from "@/components/ExampleChips";
import ExplanationView from "@/components/ExplanationView";
import HistoryList, { type HistoryItem } from "@/components/HistoryList";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";

const HISTORY_KEY = "lain_history_v1";
const HISTORY_LIMIT = 12;

function loadHistory(): HistoryItem[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item && typeof item.q === "string" && typeof item.t === "number"
    );
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Explanation | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const latestQuery = useRef("");
  const loadingRef = useRef(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const analyze = useCallback(async (rawTerm: string) => {
    const term = rawTerm.trim().slice(0, 200);
    if (!term || loadingRef.current) return;

    latestQuery.current = term;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term }),
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.ok) {
        setError(json?.error ?? `Request failed with status ${response.status}.`);
      } else {
        setResult(json.data as Explanation);
        setHistory((previous) => [
          { q: term, t: Date.now() },
          ...previous.filter((item) => item.q.toLowerCase() !== term.toLowerCase()),
        ].slice(0, HISTORY_LIMIT));
      }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-16 md:pt-24">
      <section className="fade-up text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-300/80">
          // present day, present time
        </p>
        <h1 className="mt-5 text-6xl font-bold tracking-[0.12em] md:text-8xl md:tracking-[0.18em]">
          <span
            className="glitch bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]"
            data-text="LAIN"
          >
            LAIN
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-sm leading-relaxed text-zinc-400 md:text-base">
          Paste any meme, slang word, viral phrase, trend, or reference.
          LAIN decodes what it means, where it came from, and how people actually use it.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={() => analyze(query)}
            loading={loading}
          />
          <ExampleChips
            onPick={(example) => {
              setQuery(example);
              analyze(example);
            }}
          />
        </div>
      </section>

      <div ref={resultsRef} className="mt-14 scroll-mt-20">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => analyze(latestQuery.current)} />
        ) : result ? (
          <ExplanationView explanation={result} onSearch={analyze} />
        ) : (
          <EmptyState />
        )}
      </div>

      {history.length > 0 && !loading && (
        <div className="mt-16">
          <HistoryList
            items={history}
            onSelect={(selected) => {
              setQuery(selected);
              analyze(selected);
            }}
            onClear={() => setHistory([])}
          />
        </div>
      )}
    </div>
  );
}
