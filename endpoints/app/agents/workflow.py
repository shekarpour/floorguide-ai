from __future__ import annotations

import asyncio
import time
import uuid

from app.agents.router import QuestionRouter
from app.agents.synthesizer import AnswerSynthesizer
from app.agents.verifier import EvidenceVerifier
from app.config import Settings
from app.schemas import (
    AnswerContent,
    AskRequest,
    AskResponse,
    Evidence,
    ProcessingInfo,
    ResponseDecision,
)
from app.services.gemini import GeminiStructuredClient
from app.services.retrieval import CorpusRetriever


class FloorGuideWorkflow:
    def __init__(self, settings: Settings) -> None:
        llm = None
        if not settings.use_mock_ai and settings.gemini_api_key:
            llm = GeminiStructuredClient(settings.gemini_api_key, settings.gemini_model)
        self.settings = settings
        self.router = QuestionRouter(llm)
        self.synthesizer = AnswerSynthesizer(llm)
        self.verifier = EvidenceVerifier(llm)
        self.retriever = CorpusRetriever(settings.data_dir)

    async def run(self, request: AskRequest) -> AskResponse:
        started = time.perf_counter()
        stages = ["understanding_intent"]
        plan = await self.router.route(request.question)

        stages.append("selecting_documentation")
        tool_map = {
            "safety": self.retriever.search_safety_procedures,
            "maintenance": self.retriever.search_maintenance_manuals,
            "quality": self.retriever.search_quality_standards,
        }
        results = await asyncio.gather(
            *(asyncio.to_thread(tool_map[route.source], route.subquery) for route in plan.routes)
        )
        evidence: list[Evidence] = [item for group in results for item in group]

        stages.append("retrieving_evidence")
        synthesis = await self.synthesizer.synthesize(request.question, plan, evidence)
        stages.append("verifying_answer")
        verification = await self.verifier.verify(request.question, plan, synthesis, evidence)

        decision = self._decide(plan.ambiguity_level, verification.conflict_detected, verification.support_score)
        alternatives = synthesis.alternative_answers[:3] if decision.mode == "multiple" else []
        answer = synthesis.primary_answer
        if decision.mode == "insufficient":
            answer = AnswerContent(
                summary="The available documentation does not support a reliable answer yet.",
                actions=["Provide the equipment ID, observed condition, and intended action."],
                warnings=["Do not act on an unsupported plant procedure."],
                missing_information=plan.ambiguity_reasons,
                escalation="Escalate to the appropriate plant specialist if the situation is urgent.",
                citation_ids=answer.citation_ids,
            )

        return AskResponse(
            request_id=f"req_{uuid.uuid4().hex[:12]}",
            user_name=request.user_name,
            question=request.question,
            intent=plan.intent,
            routed_sources=plan.routes,
            decision=decision,
            answer=answer,
            alternative_answers=alternatives,
            evidence=evidence,
            verification=verification,
            processing=ProcessingInfo(
                latency_ms=round((time.perf_counter() - started) * 1000),
                model=self.settings.gemini_model,
                mock_mode=self.settings.use_mock_ai,
                stages=stages,
            ),
        )

    @staticmethod
    def _decide(ambiguity_level: str, conflict_detected: bool, support_score: int) -> ResponseDecision:
        if support_score < 55:
            mode = "insufficient"
            reason = "Evidence support is below the minimum threshold; clarification or escalation is safer."
        elif conflict_detected or ambiguity_level == "high":
            mode = "multiple"
            reason = "Material ambiguity or conflicting guidance could change the recommended action."
        else:
            mode = "single"
            reason = "The evidence supports one decisive recommendation without material ambiguity."
        return ResponseDecision(
            mode=mode,
            reason=reason,
            ambiguity_level=ambiguity_level,
            conflict_detected=conflict_detected,
        )

