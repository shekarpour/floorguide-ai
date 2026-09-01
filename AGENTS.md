# FloorGuide AI repository guidance

This repository is a small full-stack monorepo. Keep the frontend, backend, evaluation assets, and presentation deliverables together, but preserve their deployment boundaries.

## Directory ownership

- `app/` owns the React/TanStack frontend. It must not contain model credentials, backend orchestration, or direct database access.
- `endpoints/` owns FastAPI, Gemini integration, retrieval, agent orchestration, prompts, mock documents, tests, and evaluations.
- `docs/` owns architecture diagrams and interview-facing presentation artifacts.
- Root files describe the complete system and shared development conventions.

The additional `app/AGENTS.md` contains Lovable-specific history and synchronization rules. Follow it for any work under `app/`.

## Architecture rules

1. Keep prompts in `endpoints/app/prompts/`, separate from Python implementation.
2. Keep orchestration deterministic and bounded; do not introduce an open-ended autonomous loop.
3. Route only to the explicit safety, maintenance, and quality sources.
4. Every operational recommendation must cite returned evidence.
5. Preserve the adaptive response contract: one answer when decisive, alternatives for material ambiguity or conflict, and insufficient evidence when the requested fact is unavailable.
6. Treat the evidence-support score as documentation support, not a probability that the answer is correct.
7. Never expose `GEMINI_API_KEY` or other server secrets to the frontend.

## Contract changes

The frontend contract is defined in `app/src/types/floorguide.ts`; the backend models live in `endpoints/app/schemas.py`. When changing a request or response field, update both sides together, then verify normalization in `app/src/lib/floorguide/api.ts`.

## Required verification

For backend changes:

```bash
cd endpoints
python -m unittest discover -s tests -v
```

For frontend changes:

```bash
cd app
pnpm run lint
pnpm run build
```

For routing, synthesis, verification, prompts, retrieval, or threshold changes:

```bash
cd endpoints
python evals/run_benchmark.py
```

Do not rewrite golden benchmark expectations merely to make a regression pass. Document failures and fix the underlying behavior.

## Git and Lovable

- The `main` branch is connected to Lovable.
- Use normal additive commits and pushes.
- Do not force-push, rebase, amend, or squash history that has already been published.
- Keep the repository runnable after each pushed commit.
- Do not commit `.env` files, API keys, virtual environments, build output, or temporary slide renders.

## Deployment

- Backend Fly app: `floorguide-qa-endpoint`, configured by `endpoints/fly.toml`.
- Frontend Fly app: `floorguide-ai-frontend`, configured by `app/fly.toml`.
- Confirm backend CORS supports the production frontend and required Lovable preview origins after changing domains.

## Product guardrail

FloorGuide is decision support for a fictional demo corpus. Never present it as authorization to bypass approved plant procedures, machine guarding, lockout/tagout, quality release controls, or human review.
