from __future__ import annotations

import json

from app.schemas import AnswerContent, Evidence, RouterPlan, SynthesisResult
from app.services.prompt_loader import load_prompt


class AnswerSynthesizer:
    def __init__(self, llm=None) -> None:
        self.llm = llm

    async def synthesize(self, question: str, plan: RouterPlan, evidence: list[Evidence]) -> SynthesisResult:
        if self.llm:
            payload = {
                "question": question,
                "plan": plan.model_dump(),
                "evidence": [item.model_dump() for item in evidence],
            }
            prompt = load_prompt("synthesizer.txt") + "\n\nWORKFLOW INPUT:\n" + json.dumps(payload, indent=2)
            return await self.llm.generate(prompt, SynthesisResult)
        return self._offline_synthesis(question, plan, evidence)

    @staticmethod
    def _offline_synthesis(question: str, plan: RouterPlan, evidence: list[Evidence]) -> SynthesisResult:
        lowered = question.lower()
        citation_ids = [item.evidence_id for item in evidence[:5]]
        warnings: list[str] = []
        actions: list[str] = []
        missing = list(plan.ambiguity_reasons)
        escalation = None

        if any(term in lowered for term in ("overheat", "overheating", "hot motor", "overload")):
            summary = "Do not open the guard or inspect the motor internally while the conveyor is operating."
            actions = [
                "Stop feeding product and perform an orderly line shutdown.",
                "Record the alarm, load, operating condition, and visible symptoms.",
                "Have authorized Maintenance apply the equipment-specific lockout/tagout procedure.",
                "After isolation and cooling, inspect ventilation, tracking, tension, pulleys, bearings, and the motor fan.",
            ]
            warnings = [
                "An emergency stop or software stop does not isolate hazardous energy.",
                "Do not repeatedly reset an overload without identifying its cause.",
            ]
            escalation = "Remove CV-07 from service and escalate if overheating or tripping recurs."
        elif "restart" in lowered:
            summary = "Restart only after Safety, Maintenance, and Quality complete their separate release checks."
            actions = [
                "Confirm guards, interlocks, tools, and personnel status before restoring energy.",
                "Run a controlled no-product functional test.",
                "Complete the required first-piece, consecutive-package, and reject checks.",
                "Keep affected product on hold until Quality releases it.",
            ]
            warnings = ["Mechanical function alone does not authorize product release."]
        elif "jam" in lowered or "reach" in lowered:
            summary = "Do not reach through a guard to clear the jam; stop the equipment and use the documented energy-control procedure."
            actions = [
                "Stop the affected machine and upstream feed.",
                "Notify the supervisor and authorized Maintenance.",
                "Apply equipment-specific lockout/tagout before entering the guarded area.",
                "Hold potentially affected product for Quality review.",
            ]
            warnings = ["A normal stop or emergency stop is not energy isolation."]
        else:
            summary = "The available documents provide related guidance, but more operational detail is needed for a decisive action."
            actions = ["Identify the equipment, observed condition, and intended action.", "Confirm the applicable approved plant procedure before acting."]
            escalation = "Escalate to the responsible Safety, Maintenance, or Quality specialist if the condition is time-critical."

        primary = AnswerContent(
            summary=summary,
            actions=actions,
            warnings=warnings,
            missing_information=missing,
            escalation=escalation,
            citation_ids=citation_ids,
        )
        alternatives: list[AnswerContent] = []
        if plan.ambiguity_level == "high":
            alternatives = [
                AnswerContent(
                    label="If you mean an immediate hazard",
                    summary="Stop the line, keep personnel clear, and use the emergency/escalation procedure.",
                    actions=["Identify the equipment and hazard before any restart or inspection."],
                    warnings=["Do not infer that an unspecified machine is safe."],
                    citation_ids=citation_ids,
                    assumption="The question refers to an active unsafe condition.",
                ),
                AnswerContent(
                    label="If you mean a routine restart",
                    summary="Provide the equipment ID and reason for shutdown so the correct restart checks can be selected.",
                    actions=["Confirm whether maintenance or product impact occurred."],
                    citation_ids=citation_ids,
                    assumption="There is no immediate hazard and the line is already in a controlled stop.",
                ),
            ]
        return SynthesisResult(primary_answer=primary, alternative_answers=alternatives)

