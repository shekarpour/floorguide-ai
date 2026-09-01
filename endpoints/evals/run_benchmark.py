from __future__ import annotations

import argparse
import json
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

import certifi


ROOT = Path(__file__).resolve().parent
DEFAULT_URL = "https://floorguide-qa-endpoint.fly.dev/api/v1/ask"


def combined_answer(response: dict[str, Any]) -> str:
    answer = response.get("answer", {})
    fields = [
        answer.get("label", ""),
        answer.get("summary", ""),
        *answer.get("actions", []),
        *answer.get("warnings", []),
        *answer.get("missing_information", []),
        answer.get("escalation") or "",
        answer.get("assumption") or "",
    ]
    return " ".join(str(field) for field in fields).lower()


def evaluate(case: dict[str, Any], response: dict[str, Any]) -> dict[str, Any]:
    text = combined_answer(response)
    actual_sources = {item["source"] for item in response.get("routed_sources", [])}
    evidence_ids = {item["evidence_id"] for item in response.get("evidence", [])}
    cited_ids = set(response.get("answer", {}).get("citation_ids", []))

    concept_results = [
        any(phrase.lower() in text for phrase in alternatives)
        for alternatives in case["required_concept_groups"]
    ]
    forbidden_hits = [
        phrase for phrase in case["forbidden_phrases"] if phrase.lower() in text
    ]
    source_pass = set(case["gold_sources"]).issubset(actual_sources)
    mode_pass = response.get("decision", {}).get("mode") == case["expected_mode"]
    citation_pass = bool(cited_ids) and cited_ids.issubset(evidence_ids)
    support_score = response.get("verification", {}).get("support_score", -1)
    support_pass = support_score >= case.get("min_support_score", 0)
    if "max_support_score" in case:
        support_pass = support_pass and support_score <= case["max_support_score"]

    checks = {
        "required_concepts": all(concept_results),
        "no_unsafe_or_invented_guidance": not forbidden_hits,
        "expected_sources": source_pass,
        "expected_decision_mode": mode_pass,
        "valid_evidence_citations": citation_pass,
        "support_threshold": support_pass,
    }
    earned = sum(1 for value in checks.values() if value)
    return {
        "id": case["id"],
        "category": case["category"],
        "passed": all(checks.values()),
        "score": round(100 * earned / len(checks)),
        "checks": checks,
        "missing_concept_groups": [
            group for group, passed in zip(case["required_concept_groups"], concept_results) if not passed
        ],
        "forbidden_hits": forbidden_hits,
        "actual_sources": sorted(actual_sources),
        "actual_mode": response.get("decision", {}).get("mode"),
        "support_score": support_score,
        "request_id": response.get("request_id"),
        "latency_ms": response.get("processing", {}).get("latency_ms"),
        "answer_summary": response.get("answer", {}).get("summary"),
    }


def call_endpoint(url: str, question: str) -> dict[str, Any]:
    payload = json.dumps({"user_name": "Benchmark Evaluator", "question": question}).encode()
    request = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    tls_context = ssl.create_default_context(cafile=certifi.where())
    with urllib.request.urlopen(request, timeout=120, context=tls_context) as response:
        return json.loads(response.read())


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the five-case FloorGuide golden benchmark.")
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--output", type=Path, default=ROOT / "latest_results.json")
    args = parser.parse_args()

    cases = json.loads((ROOT / "benchmark.json").read_text())
    results: list[dict[str, Any]] = []
    started = time.time()

    for case in cases:
        print(f"Running {case['id']}: {case['category']}...", flush=True)
        try:
            response = call_endpoint(args.url, case["question"])
            result = evaluate(case, response)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            result = {
                "id": case["id"],
                "category": case["category"],
                "passed": False,
                "score": 0,
                "error": str(exc),
            }
        results.append(result)
        print(f"  {'PASS' if result['passed'] else 'FAIL'} ({result['score']}%)", flush=True)

    report = {
        "benchmark_version": "1.0",
        "endpoint": args.url,
        "cases": len(cases),
        "passed": sum(1 for result in results if result["passed"]),
        "average_score": round(sum(result["score"] for result in results) / len(results), 1),
        "wall_time_seconds": round(time.time() - started, 1),
        "results": results,
    }
    args.output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({key: report[key] for key in ("cases", "passed", "average_score", "wall_time_seconds")}, indent=2))
    print(f"Full results: {args.output}")


if __name__ == "__main__":
    main()
