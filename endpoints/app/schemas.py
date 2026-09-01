from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator

SourceName = Literal["safety", "maintenance", "quality"]
SupportLevel = Literal["high", "medium", "low"]
AmbiguityLevel = Literal["low", "medium", "high"]
ResponseMode = Literal["single", "multiple", "insufficient"]


class AskRequest(BaseModel):
    user_name: str = Field(min_length=1, max_length=100)
    question: str = Field(min_length=10, max_length=1000)

    @field_validator("user_name", "question")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        return " ".join(value.split())


class SourceRoute(BaseModel):
    source: SourceName
    reason: str
    subquery: str


class RouterPlan(BaseModel):
    intent: str
    routes: list[SourceRoute] = Field(min_length=1, max_length=3)
    ambiguity_level: AmbiguityLevel = "low"
    ambiguity_reasons: list[str] = Field(default_factory=list, max_length=4)


class Evidence(BaseModel):
    evidence_id: str
    source: SourceName
    document_id: str
    document_title: str
    document_url: str
    section_url: str
    section: str
    section_title: str
    excerpt: str
    relevance: float = Field(ge=0, le=1)


class AnswerContent(BaseModel):
    label: str = "Recommended answer"
    summary: str
    actions: list[str] = Field(default_factory=list, max_length=8)
    warnings: list[str] = Field(default_factory=list, max_length=5)
    missing_information: list[str] = Field(default_factory=list, max_length=5)
    escalation: str | None = None
    citation_ids: list[str] = Field(default_factory=list)
    assumption: str | None = None


class SynthesisResult(BaseModel):
    primary_answer: AnswerContent
    alternative_answers: list[AnswerContent] = Field(default_factory=list, max_length=3)


class VerificationResult(BaseModel):
    support_score: int = Field(ge=0, le=100)
    support_level: SupportLevel
    claims_total: int = Field(ge=0)
    claims_supported: int = Field(ge=0)
    unsupported_claims: list[str] = Field(default_factory=list, max_length=6)
    conflict_detected: bool = False
    conflict_summary: str | None = None
    ambiguity_level: AmbiguityLevel = "low"
    decision_reason: str


class ResponseDecision(BaseModel):
    mode: ResponseMode
    reason: str
    ambiguity_level: AmbiguityLevel
    conflict_detected: bool


class ProcessingInfo(BaseModel):
    latency_ms: int
    model: str
    mock_mode: bool
    stages: list[str]


class AskResponse(BaseModel):
    request_id: str
    user_name: str
    question: str
    intent: str
    routed_sources: list[SourceRoute]
    decision: ResponseDecision
    answer: AnswerContent
    alternative_answers: list[AnswerContent]
    evidence: list[Evidence]
    verification: VerificationResult
    processing: ProcessingInfo


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    model: str
    mock_mode: bool
