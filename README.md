# LAIN

LAIN is an AI-powered decoder for internet culture. Type in any meme, slang word, viral phrase, trend, or reference and LAIN explains what it means, where it came from, why it blew up, how people actually use it, and whether it is current, outdated, ironic, or risky — powered by an AI model served through OpenRouter.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [OpenRouter](https://openrouter.ai/) chat completions API for AI explanations
- No database: explanations are cached in memory per server process; search history lives in the browser's localStorage

## How it works

1. The user enters a term on the home page (`app/page.tsx`) and clicks Analyze.
2. The browser sends a `POST /api/explain` request with the query.
3. The API route (`app/api/explain/route.ts`) normalizes the query (trimmed, capped at 200 chars) and checks a small in-memory LRU-style cache (`lib/cache.ts`, 24h TTL, max 200 entries). Cache hits return instantly.
4. On a miss, `explainTerm` in `lib/ai.ts` calls the OpenRouter chat completions endpoint using `OPENROUTER_API_KEY`, asking the model (from `OPENROUTER_MODEL`) to reply with a single strict JSON object defined by the system prompt in `lib/prompts.ts`.
5. The response is parsed and validated into an `Explanation` object (`lib/types.ts`): term, category, summary, meaning, origin, popularity, usage, tone, status, usage examples, and related terms.
6. The result is cached and rendered by the UI components in `components/`. Recent searches are kept client-side in localStorage.

The API key never reaches the browser — all OpenRouter calls happen server-side inside the API route.

## Requirements

- Node.js 18.17 or newer (tested with Node 24)
- An [OpenRouter](https://openrouter.ai/) account with an API key

## Installation

```bash
git clone <your-repo-url> lain
cd lain
npm install
```

## Configuration

Create a `.env.local` file in the project root (copy `.env.example` as a starting point):

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set your real values.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key from https://openrouter.ai/keys |
| `OPENROUTER_MODEL` | No | Model id to use (defaults to `stealth/ox-alpha`). Example: any valid OpenRouter model id. |
| `OPENROUTER_BASE_URL` | No | Override only if you use a compatible proxy (defaults to `https://openrouter.ai/api/v1`) |

Never commit `.env.local`. It is already covered by `.gitignore`.

## Running locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Production mode:

```bash
npm run build
npm start
```

## Testing

There is no automated test suite yet. Verify the main flow manually:

1. Start the dev server: `npm run dev`
2. Go to http://localhost:3000
3. Enter a well-known slang term (for example `rizz`) and click **Analyze**
4. Expected result:
   - A loading state appears briefly
   - A structured explanation card renders: summary, meaning, origin, popularity, usage, tone, status badge, usage examples, and related terms
   - The search appears in your recent-searches list (localStorage)
5. Repeat step 3 with the same term — the response should be noticeably faster (served from cache)
6. Clearing `.env.local` of the key and restarting should produce a friendly configuration error instead of a crash

You can also test the API directly:

```powershell
curl.exe -X POST http://localhost:3000/api/explain -H "Content-Type: application/json" -d "{\"query\":\"rizz\"}"
```

## Troubleshooting

- **"Server is not configured yet..."** — `OPENROUTER_API_KEY` is missing from `.env.local`; add it and restart the dev server
- **401** — the key is wrong or revoked
- **402** — the OpenRouter account behind the key has no credits
- **404 mentioning the model id** — set `OPENROUTER_MODEL` to a valid model id on OpenRouter
- **429** — rate limited; wait and retry

## Project structure

```
app/
  api/explain/route.ts   POST endpoint that decodes a term
  layout.tsx             Root layout, fonts, background effects
  page.tsx               Home page UI and state management
components/              SearchBar, ExampleChips, ExplanationView,
                         HistoryList, Navbar, Footer, loading/error states
lib/
  ai.ts                  OpenRouter call + response validation
  prompts.ts             System prompt enforcing the JSON contract
  cache.ts               In-memory TTL cache
  types.ts               Shared TypeScript types
```
