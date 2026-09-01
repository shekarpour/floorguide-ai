# FloorGuide AI

FloorGuide AI is a working manufacturing knowledge-assistant prototype built for the Agentic Forward-Deployed Engineer challenge. A floor supervisor submits an operational question; the backend routes it across safety, maintenance, and quality documentation, retrieves evidence, synthesizes a grounded answer, and verifies its support before returning an adaptive response.

## Project structure

- `app/` — React/TanStack frontend deployed on Fly.io
- `endpoints/` — FastAPI agentic workflow and document endpoints deployed on Fly.io
- `docs/` — architecture and executive presentation artifacts
- `endpoints/data/` — fictional, compact plant documentation used as the prototype corpus
- `endpoints/evals/` — five-question golden benchmark and latest results

## Live applications

- Frontend: https://floorguide-ai-frontend.fly.dev
- Backend API: https://floorguide-qa-endpoint.fly.dev
- API documentation: https://floorguide-qa-endpoint.fly.dev/docs

## Local development

Frontend:

```bash
cd app
pnpm install
cp .env.example .env
pnpm run dev
```

Backend:

```bash
cd endpoints
cp .env.example .env
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The Gemini API key is configured only as a backend environment variable/Fly secret and is never included in the frontend or repository.
