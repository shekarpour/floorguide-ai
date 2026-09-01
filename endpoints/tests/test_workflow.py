from __future__ import annotations

import asyncio
import unittest
from pathlib import Path

from app.agents.router import QuestionRouter
from app.agents.workflow import FloorGuideWorkflow
from app.config import Settings
from app.schemas import AskRequest
from app.services.documents import DocumentLibrary, DocumentNotFoundError


DATA_DIR = Path(__file__).resolve().parents[1] / "data"


def settings() -> Settings:
    return Settings(
        gemini_api_key=None,
        gemini_model="gemini-3.7-flash",
        use_mock_ai=True,
        allowed_origins=("http://localhost:5173",),
        data_dir=DATA_DIR,
    )


class RouterTests(unittest.TestCase):
    def test_routes_cross_source_overheating_question(self) -> None:
        plan = QuestionRouter._heuristic_route(
            "The CV-07 conveyor motor is overheating. Can I open the guard and inspect it while running?"
        )
        sources = {route.source for route in plan.routes}
        self.assertIn("safety", sources)
        self.assertIn("maintenance", sources)

    def test_routes_quality_restart_question(self) -> None:
        plan = QuestionRouter._heuristic_route(
            "What quality checks are required before restarting SL-07 after a seal adjustment?"
        )
        sources = {route.source for route in plan.routes}
        self.assertIn("maintenance", sources)
        self.assertIn("quality", sources)


class DocumentLibraryTests(unittest.TestCase):
    def test_renders_section_anchors_for_clickable_citations(self) -> None:
        rendered = DocumentLibrary(DATA_DIR).render("SAFE-PKG07-001")
        self.assertIn('id="section-8"', rendered)
        self.assertIn("Overheating, unusual noise", rendered)

    def test_unknown_document_is_rejected(self) -> None:
        with self.assertRaises(DocumentNotFoundError):
            DocumentLibrary(DATA_DIR).render("UNKNOWN")


class DecisionPolicyTests(unittest.TestCase):
    def test_single_answer_is_default_for_decisive_evidence(self) -> None:
        decision = FloorGuideWorkflow._decide("low", False, 88)
        self.assertEqual(decision.mode, "single")

    def test_multiple_answers_only_for_material_ambiguity(self) -> None:
        decision = FloorGuideWorkflow._decide("high", False, 70)
        self.assertEqual(decision.mode, "multiple")

    def test_conflict_triggers_multiple_answers(self) -> None:
        decision = FloorGuideWorkflow._decide("low", True, 82)
        self.assertEqual(decision.mode, "multiple")

    def test_low_support_abstains_even_when_ambiguous(self) -> None:
        decision = FloorGuideWorkflow._decide("high", True, 40)
        self.assertEqual(decision.mode, "insufficient")


class WorkflowTests(unittest.TestCase):
    def test_decisive_question_returns_one_grounded_answer(self) -> None:
        workflow = FloorGuideWorkflow(settings())
        response = asyncio.run(
            workflow.run(
                AskRequest(
                    user_name="Jordan Lee",
                    question="The CV-07 conveyor motor is overheating. Can I open the guard and inspect it while running?",
                )
            )
        )
        self.assertEqual(response.decision.mode, "single")
        self.assertEqual(response.alternative_answers, [])
        self.assertGreaterEqual(len(response.evidence), 2)
        self.assertIn("safety", {item.source for item in response.evidence})
        self.assertIn("maintenance", {item.source for item in response.evidence})
        self.assertTrue(all(item.section_url.startswith("/api/v1/documents/") for item in response.evidence))

    def test_ambiguous_question_returns_interpretations(self) -> None:
        workflow = FloorGuideWorkflow(settings())
        response = asyncio.run(
            workflow.run(AskRequest(user_name="Jordan Lee", question="Can I restart it now after this?"))
        )
        self.assertEqual(response.decision.mode, "multiple")
        self.assertEqual(len(response.alternative_answers), 2)


if __name__ == "__main__":
    unittest.main()
