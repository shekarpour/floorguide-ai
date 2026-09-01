from __future__ import annotations

import json

from app.schemas import RouterPlan, SourceRoute
from app.services.prompt_loader import load_prompt

SOURCE_TERMS = {
    "safety": {
        "safe", "safety", "guard", "interlock", "lockout", "tagout", "loto", "hazard",
        "emergency", "injury", "smoke", "sparking", "reach", "energized", "running",
    },
    "maintenance": {
        "motor", "belt", "conveyor", "overheat", "overheating", "drift", "tracking", "repair",
        "inspect", "adjust", "adjustment", "noise", "vibration", "jam", "temperature", "bearing", "sealer", "filler",
    },
    "quality": {
        "quality", "restart", "release", "product", "weight", "seal", "label", "code", "hold",
        "reject", "package", "inspection", "recipe", "checkweigher", "contamination",
    },
}


class QuestionRouter:
    def __init__(self, llm=None) -> None:
        self.llm = llm

    async def route(self, question: str) -> RouterPlan:
        if self.llm:
            prompt = load_prompt("router.txt") + "\n\nUSER QUESTION:\n" + question
            return await self.llm.generate(prompt, RouterPlan)
        return self._heuristic_route(question)

    @staticmethod
    def _heuristic_route(question: str) -> RouterPlan:
        lowered = question.lower()
        words = set(lowered.replace("/", " ").replace("?", " ").split())
        routes: list[SourceRoute] = []
        reasons = {
            "safety": "The question may involve personnel exposure, guarding, or hazardous energy.",
            "maintenance": "The question asks about equipment condition, inspection, or troubleshooting.",
            "quality": "The question may affect product conformity, restart checks, or release.",
        }
        for source, terms in SOURCE_TERMS.items():
            if words & terms or any(term in lowered for term in terms if len(term) > 5):
                routes.append(SourceRoute(source=source, reason=reasons[source], subquery=question))

        if not routes:
            routes = [SourceRoute(source="safety", reason="Safety is the conservative default for an unclear plant-floor action.", subquery=question)]

        ambiguous_pronouns = any(f" {token} " in f" {lowered} " for token in ("it", "this", "that"))
        equipment_named = any(code in lowered for code in ("cv-07", "fl-07", "sl-07", "lb-07", "ck-07"))
        very_short = len(words) <= 7
        ambiguity_reasons = []
        if ambiguous_pronouns and not equipment_named:
            ambiguity_reasons.append("The equipment or condition referenced by a pronoun is not identified.")
        if very_short:
            ambiguity_reasons.append("The question provides limited operational context.")
        level = "high" if len(ambiguity_reasons) >= 2 else "medium" if ambiguity_reasons else "low"
        return RouterPlan(
            intent="Determine the documented action for the plant-floor question.",
            routes=routes[:3],
            ambiguity_level=level,
            ambiguity_reasons=ambiguity_reasons,
        )
