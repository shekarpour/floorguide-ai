# FloorGuide AI

FloorGuide AI is a deployed manufacturing knowledge-assistant prototype built for an Agentic Forward-Deployed Engineer interview challenge. A floor supervisor asks an operational question, and a bounded agent workflow routes it across safety, maintenance, and quality documentation before returning a cited, evidence-scored answer.

The system favors one decisive answer when the documentation is clear. When evidence is missing, ambiguous, or conflicting, the response policy can present alternatives or escalate rather than inventing a plant procedure.

## Live prototype

| Service | URL |
| --- | --- |
| Web application | [floorguide-ai-frontend.fly.dev](https://floorguide-ai-frontend.fly.dev) |
| FastAPI backend | [floorguide-qa-endpoint.fly.dev](https://floorguide-qa-endpoint.fly.dev) |
| OpenAPI documentation | [floorguide-qa-endpoint.fly.dev/docs](https://floorguide-qa-endpoint.fly.dev/docs) |
| Health check | [floorguide-qa-endpoint.fly.dev/health](https://floorguide-qa-endpoint.fly.dev/health) |

## Repository organization

```text
floorguide-ai/
├── app/                         React/TanStack frontend
│   ├── src/components/          UI and result components
│   ├── src/lib/floorguide/      API client and normalization
│   ├── src/types/               Frontend contract types
│   ├── Dockerfile               Frontend container
│   └── fly.toml                 Frontend Fly.io configuration
├── endpoints/                   FastAPI backend and agent workflow
│   ├── app/agents/              Router, synthesizer, verifier, orchestration
│   ├── app/api/                 Question and document endpoints
│   ├── app/prompts/             Versioned prompts separate from Python
│   ├── app/services/            Gemini, retrieval, documents, prompt loading
│   ├── data/                    Compact fictional plant corpus
│   ├── evals/                   Golden benchmark and recorded results
│   ├── tests/                   Backend workflow tests
│   ├── Dockerfile               Backend container
│   └── fly.toml                 Backend Fly.io configuration
├── docs/                        Architecture and presentation deliverables
├── AGENTS.md                    Repository-wide engineering guidance
└── README.md                    Project overview and operating instructions
```

The frontend and backend intentionally remain separate. The browser never receives a Gemini key and communicates only with the FastAPI service.

## Agent workflow

```text
Question API
    → intent and source router
    → source-specific retrieval from 1–3 document categories
    → grounded answer synthesis with citations
    → evidence and conflict verification
    → decision gate: single answer, alternatives, or insufficient evidence
```

Python controls sequencing, source access, response thresholds, and failure handling. Gemini performs structured reasoning inside bounded prompts. The prototype uses compact Markdown documents as a mock corpus so retrieval, citation, and evaluation behavior remain inspectable.

## Response design

The API returns a structured response containing:

- recognized intent and selected sources;
- one recommended answer by default;
- recommended actions, safety warnings, and escalation guidance;
- evidence cards with clickable document-section URLs;
- claim coverage and an evidence-support score;
- decision metadata explaining why the result is decisive, ambiguous, or insufficient;
- a request ID and processing latency for traceability.

## API example

```bash
curl -X POST https://floorguide-qa-endpoint.fly.dev/api/v1/ask \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "Jordan Lee",
    "question": "Can I reach through the guard to clear a pouch jam?"
  }'
```

Browsable source documents are served by the backend at `GET /api/v1/documents/{document_id}` with optional section anchors.

## Local development

### Frontend

```bash
cd app
corepack enable
pnpm install
cp .env.example .env
pnpm run dev
```

Set `VITE_API_BASE_URL=http://localhost:8000` in `app/.env`. Set `VITE_USE_MOCK_API=true` only when intentionally testing the isolated frontend mock.

### Backend

```bash
cd endpoints
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Use `USE_MOCK_AI=true` for deterministic local execution. For Gemini-backed execution, set `GEMINI_API_KEY` only in `endpoints/.env` or as a Fly secret and set `USE_MOCK_AI=false`.

## Verification

```bash
# Backend tests
cd endpoints
python -m unittest discover -s tests -v

# Frontend checks
cd ../app
pnpm run lint
pnpm run build

# Live golden benchmark
cd ../endpoints
python evals/run_benchmark.py
```

The current five-query live benchmark produced three full passes and an 86.6% average check score. The two misses are documented rather than hidden: one omitted an exact restart quantity, and one exposed a mismatch between claim support and whether the user's requested fact was answerable. See [`endpoints/evals/latest_report.md`](endpoints/evals/latest_report.md).

## Deployment

Both services deploy independently from their own folders:

```bash
cd endpoints
fly deploy

cd ../app
fly deploy
```

Fly secrets are service-specific. Do not place API keys in Git, frontend environment variables, Dockerfiles, or committed configuration.

## Documentation

- [`docs/README.md`](docs/README.md) — architecture and presentation index
- [`endpoints/README.md`](endpoints/README.md) — backend setup and API details
- [`app/README.md`](app/README.md) — frontend setup and contract details
- [`AGENTS.md`](AGENTS.md) — engineering guidance for AI coding agents and contributors

## Prototype boundaries

- The plant documents are fictional and intentionally compact.
- This is decision support, not autonomous equipment control.
- Human approval remains the final control point.
- A production version would add governed ingestion, identity and permissions, audit retention, semantic evaluation, and an explicit requested-fact answerability gate.
