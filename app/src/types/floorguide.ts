/**
 * FloorGuide AI — typed API contract.
 *
 * Single source of truth for the request/response shapes exchanged with the
 * FastAPI backend at POST ${VITE_API_BASE_URL}/api/v1/ask
 * (deployed QA endpoint: https://floorguide-qa-endpoint.fly.dev).
 */

export type SourceKey = "safety" | "maintenance" | "quality";
export type DecisionMode = "single" | "multiple" | "insufficient";
export type SupportLevel = "high" | "medium" | "low";
export type AmbiguityLevel = "low" | "medium" | "high";

/** POST /api/v1/ask — request body */
export interface AskRequest {
  /** 1–100 characters */
  user_name: string;
  /** 10–1000 characters */
  question: string;
}

export interface SourceRoute {
  source: SourceKey;
  /** Short human-readable justification for routing to this source. */
  reason: string;
  subquery: string;
}

export interface AnswerBody {
  label: string;
  summary: string;
  actions: string[];
  warnings: string[];
  missing_information: string[];
  escalation: string | null;
  citation_ids: string[];
  assumption: string | null;
}

export interface EvidenceItem {
  evidence_id: string;
  source: SourceKey;
  document_id: string;
  document_title: string;
  /** Backend path to the full document, e.g. /api/v1/documents/SAFE-PKG07-001 */
  document_url: string;
  /** Backend path that opens the document and scrolls to the cited section. */
  section_url: string;
  /** Section number, e.g. "8" or "5.3". */
  section: string;
  section_title: string;
  excerpt: string;
  /** 0..1 relevance score. */
  relevance: number;
}

export interface Decision {
  mode: DecisionMode;
  reason: string;
  ambiguity_level: AmbiguityLevel;
  conflict_detected: boolean;
}

export interface Verification {
  /** 0..100 evidence-support score — NOT a probability of correctness. */
  support_score: number;
  support_level: SupportLevel;
  claims_total: number;
  claims_supported: number;
  unsupported_claims: string[];
  conflict_detected: boolean;
  conflict_summary: string | null;
  ambiguity_level: AmbiguityLevel;
  decision_reason: string;
}

export interface ProcessingInfo {
  latency_ms: number;
  model: string;
  mock_mode: boolean;
  stages: string[];
}

/** POST /api/v1/ask — response body */
export interface AskResponse {
  request_id: string;
  user_name: string;
  question: string;
  intent: string;
  routed_sources: SourceRoute[];
  decision: Decision;
  answer: AnswerBody;
  alternative_answers: AnswerBody[];
  evidence: EvidenceItem[];
  verification: Verification;
  processing?: ProcessingInfo;
}

/** Local-only feedback model (not persisted in the MVP). */
export type FeedbackReason =
  "incorrect_source" | "incomplete_answer" | "potentially_unsafe" | "unclear" | "other";

export interface FeedbackSubmission {
  request_id: string;
  verdict: "approved" | "needs_correction";
  reasons: FeedbackReason[];
  comments: string;
}

export const SOURCE_LABELS: Record<SourceKey, string> = {
  safety: "Safety Procedures",
  maintenance: "Maintenance Manuals",
  quality: "Quality Standards",
};

export function supportLevelFromScore(score: number): SupportLevel {
  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "low";
}
