import type { Explanation } from "./types";

interface CacheEntry {
  data: Explanation;
  expiresAt: number;
}

const TTL_MS = 1000 * 60 * 60 * 24;
const MAX_ENTRIES = 200;

const store = new Map<string, CacheEntry>();

export function normalizeKey(query: string): string {
  return query.trim().toLowerCase();
}

export function getCachedExplanation(key: string): Explanation | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  store.delete(key);
  store.set(key, entry);
  return entry.data;
}

export function setCachedExplanation(key: string, data: Explanation): void {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { data, expiresAt: Date.now() + TTL_MS });
}
