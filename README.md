# FloorGuide AI — Frontend

Plant knowledge assistant UI. Floor supervisors submit an operational question; the
backend routes it to Safety, Maintenance, and/or Quality documentation and returns a
grounded answer with citations and an evidence-support score.

React + TypeScript + Vite + Tailwind CSS. No backend code, no auth, no direct database
access. All model access happens server-side — no AI keys are ever present in this app.

## Local startup

```bash
bun install        # or: npm install
cp .env.example .env
bun run dev        # or: npm run dev
```

Open the printed local URL (default http://localhost:8080).

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend, e.g. `http://localhost:8000` |
| `VITE_USE_MOCK_API` | `true` serves an isolated local mock response; set to `false` to call the real API |

## API contract

Single endpoint: `POST ${VITE_API_BASE_URL}/api/v1/ask`

Request:

```json
{ "user_name": "Jordan Lee", "question": "..." }
```

The full typed request/response contract lives in **`src/types/floorguide.ts`** — it is
the source of truth for the FastAPI implementation. Responses are defensively normalized
in `src/lib/floorguide/api.ts`, so partial or malformed payloads degrade gracefully
instead of crashing the UI.

## Key files

- `src/types/floorguide.ts` — API TypeScript interfaces (the contract)
- `src/lib/floorguide/api.ts` — the only module that performs HTTP calls
- `src/lib/floorguide/mock-response.ts` — isolated mock data (mock mode only)
- `src/components/floorguide/*` — UI components
- `src/routes/index.tsx` — page composition and request/workflow state
