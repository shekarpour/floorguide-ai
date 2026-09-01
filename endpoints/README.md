# FloorGuide AI API

FastAPI prototype for the manufacturing scenario. One endpoint routes each question to one or more mock-document tools, synthesizes a grounded answer, verifies evidence support, and returns one answer by default. Two or three alternatives are returned only for material ambiguity or conflicting guidance.

## Run locally

```bash
cd endpoints
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set `USE_MOCK_AI=true` for deterministic offline behavior. For live Gemini calls, set `GEMINI_API_KEY` and `USE_MOCK_AI=false`.

## API

```http
POST /api/v1/ask
Content-Type: application/json

{
  "user_name": "Jordan Lee",
  "question": "The CV-07 conveyor motor is overheating. Can I open the guard and inspect it while running?"
}
```

OpenAPI documentation is available at `/docs`; health is available at `/health`.

## Tests

```bash
python -m unittest discover -s tests -v
```

## Golden benchmark

Five validated questions cover safety, maintenance, quality, cross-source reasoning, and abstention when a requested specification is absent. Run them against the deployed API with:

```bash
python evals/run_benchmark.py
```

The detailed machine-readable report is written to `evals/latest_results.json`.
