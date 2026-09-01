/**
 * FloorGuide AI — typed API contract.
 *
 * This file is the single source of truth for the request/response shapes
 * exchanged with the FastAPI backend at POST ${VITE_API_BASE_URL}/api/v1/ask
 */

export type SourceKey = "safety" | "maintenance" | "quality";

export type SupportLevel = "high" | "medium" | "low";

/** POST /api/v1/ask — request body */
export interface AskRequest {
  user_name: string;
  question: string;
}

export interface RoutedSource {
  source: SourceKey;
  /** Short human-readable justification for routing to this source. */
  reason: string;
}

export interface AnswerBody {
  summary: string;
  actions: string[];
  warnings: string[];
  missing_information: string[];
  escalation: string;
}

export interface EvidenceItem {
  source: SourceKey;
  document_id: string;
  document_title: string;
  /** Section number, e.g. "8" or "5.3". */
  section: string;
  section_title: string;
  excerpt: string;
  /** 0..1 relevance score. */
  relevance: number;
}

export interface Verification {
  /** 0..100 evidence-support score. */
  support_score: number;
  support_level: SupportLevel;
  claims_total: number;
  claims_supported: number;
  unsupported_claims: string[];
  sources_consulted: number;
}

export interface ProcessingInfo {
  latency_ms: number;
}

/** POST /api/v1/ask — response body */
export interface AskResponse {
  request_id: string;
  user_name: string;
  question: string;
  intent: string;
  routed_sources: RoutedSource[];
  answer: AnswerBody;
  evidence: EvidenceItem[];
  verification: Verification;
  processing?: ProcessingInfo;
}

/** Local-only feedback model (not persisted in the MVP). */
export type FeedbackReason =
  | "incorrect_source"
  | "incomplete_answer"
  | "potentially_unsafe"
  | "unclear"
  | "other";

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
