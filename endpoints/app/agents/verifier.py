from __future__ import annotations

import json

from app.schemas import Evidence, RouterPlan, SynthesisResult, VerificationResult
from app.services.prompt_loader import load_prompt


class EvidenceVerifier:
    def __init__(self, llm=None) -> None:
        self.llm = llm

    async def verify(
        self,
        question: str,
        plan: RouterPlan,
        synthesis: SynthesisResult,
        evidence: list[Evidence],
    ) -> VerificationResult:
        if self.llm:
            payload = {
                "question": question,
                "plan": plan.model_dump(),
                "answer": synthesis.model_dump(),
                "evidence": [item.model_dump() for item in evidence],
            }
            prompt = load_prompt("verifier.txt") + "\n\nVERIFICATION INPUT:\n" + json.dumps(payload, indent=2)
            return await self.llm.generate(prompt, VerificationResult)
        return self._offline_verify(question, plan, synthesis, evidence)

    @staticmethod
    def _offline_verify(
        question: str,
        plan: RouterPlan,
        synthesis: SynthesisResult,
        evidence: list[Evidence],
    ) -> VerificationResult:
        cited = set(synthesis.primary_answer.citation_ids)
        valid_citations = cited & {item.evidence_id for item in evidence}
        coverage = len(valid_citations) / max(1, len(cited))
        route_coverage = len({item.source for item in evidence}) / max(1, len(plan.routes))
        mean_relevance = sum(item.relevance for item in evidence) / max(1, len(evidence))
        score = round(35 * mean_relevance + 30 * coverage + 20 * route_coverage + 15 * (1 if evidence else 0))
        if plan.ambiguity_level == "high":
            score = min(score, 72)
        conflict = any(term in question.lower() for term in ("conflict", "contradict", "disagree"))
        level = "high" if score >= 80 else "medium" if score >= 55 else "low"
        claims_total = max(1, 1 + len(synthesis.primary_answer.actions) + len(synthesis.primary_answer.warnings))
        claims_supported = min(claims_total, round(claims_total * min(1, coverage * route_coverage)))
        return VerificationResult(
            support_score=score,
            support_level=level,
            claims_total=claims_total,
            claims_supported=claims_supported,
            unsupported_claims=[] if claims_supported == claims_total else ["Some answer details require additional source confirmation."],
            conflict_detected=conflict,
            conflict_summary="The question explicitly indicates conflicting guidance." if conflict else None,
            ambiguity_level=plan.ambiguity_level,
            decision_reason="Evidence coverage, route coverage, relevance, and ambiguity were evaluated.",
        )

