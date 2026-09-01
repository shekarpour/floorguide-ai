/**
 * FloorGuide AI — API service.
 *
 * The only module that talks to the FastAPI backend. No AI keys live here:
 * all model access happens server-side.
 */
import type {
  AnswerBody,
  AskRequest,
  AskResponse,
  EvidenceItem,
  SourceKey,
} from "@/types/floorguide";
import { supportLevelFromScore } from "@/types/floorguide";
import { buildMockResponse } from "./mock-response";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ||
  "https://floorguide-qa-endpoint.fly.dev";
const MOCK_FLAG = import.meta.env["VITE_USE_MOCK_API"] as string | undefined;
/** Mock mode only on explicit opt-in; otherwise the live QA endpoint is used. */
export const USE_MOCK_API = MOCK_FLAG === "true";

/** Backend requests routinely take 15–30s; allow at least 60s. */
export const REQUEST_TIMEOUT_MS = 60_000;

/** Builds an absolute URL to the cited document section. */
export function getCitationUrl(item: EvidenceItem): string {
  return new URL(item.section_url, API_BASE_URL).toString();
}

export class ApiError extends Error {
  status: number | undefined;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const VALID_SOURCES: SourceKey[] = ["safety", "maintenance", "quality"];

const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asString = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;
const asNullableString = (v: unknown): string | null =>
  typeof v === "string" && v.length > 0 ? v : null;
const asNumber = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const asBoolean = (v: unknown): boolean => v === true;
const asSource = (v: unknown): SourceKey =>
  VALID_SOURCES.includes(v as SourceKey) ? (v as SourceKey) : "safety";
const asLevel = (v: unknown): "low" | "medium" | "high" =>
  v === "low" || v === "medium" || v === "high" ? v : "low";
const asStringList = (v: unknown): string[] =>
  asArray(v).map((x) => asString(x)).filter(Boolean);

function normalizeAnswer(raw: unknown): AnswerBody {
  const a = (raw ?? {}) as Record<string, unknown>;
  return {
    label: asString(a["label"], "Recommended answer"),
    summary: asString(a["summary"]),
    actions: asStringList(a["actions"]),
    warnings: asStringList(a["warnings"]),
    missing_information: asStringList(a["missing_information"]),
    escalation: asNullableString(a["escalation"]),
    citation_ids: asStringList(a["citation_ids"]),
    assumption: asNullableString(a["assumption"]),
  };
}

/**
 * Defensive normalizer: tolerates malformed or partial payloads so the UI
 * never crashes on an unexpected backend response.
 */
export function normalizeAskResponse(raw: unknown, req: AskRequest): AskResponse {
  const r = (raw ?? {}) as Record<string, unknown>;
  const decision = (r["decision"] ?? {}) as Record<string, unknown>;
  const verification = (r["verification"] ?? {}) as Record<string, unknown>;
  const processing = (r["processing"] ?? {}) as Record<string, unknown>;

  const score = Math.max(0, Math.min(100, asNumber(verification["support_score"], 0)));
  const rawMode = decision["mode"];

  return {
    request_id: asString(r["request_id"], `req_${Date.now()}`),
    user_name: asString(r["user_name"], req.user_name),
    question: asString(r["question"], req.question),
    intent: asString(r["intent"]),
    routed_sources: asArray(r["routed_sources"]).map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return {
        source: asSource(o["source"]),
        reason: asString(o["reason"]),
        subquery: asString(o["subquery"]),
      };
    }),
    decision: {
      mode:
        rawMode === "single" || rawMode === "multiple" || rawMode === "insufficient"
          ? rawMode
          : "single",
      reason: asString(decision["reason"]),
      ambiguity_level: asLevel(decision["ambiguity_level"]),
      conflict_detected: asBoolean(decision["conflict_detected"]),
    },
    answer: normalizeAnswer(r["answer"]),
    alternative_answers: asArray(r["alternative_answers"]).map(normalizeAnswer),
    evidence: asArray(r["evidence"]).map((e, i) => {
      const o = (e ?? {}) as Record<string, unknown>;
      const document_id = asString(o["document_id"]);
      return {
        evidence_id: asString(o["evidence_id"], `ev_${i}`),
        source: asSource(o["source"]),
        document_id,
        document_title: asString(o["document_title"], "Untitled document"),
        document_url: asString(
          o["document_url"],
          `/api/v1/documents/${document_id}`,
        ),
        section_url: asString(
          o["section_url"],
          `/api/v1/documents/${document_id}#section-${asString(o["section"])}`,
        ),
        section: asString(o["section"]),
        section_title: asString(o["section_title"]),
        excerpt: asString(o["excerpt"]),
        relevance: Math.max(0, Math.min(1, asNumber(o["relevance"], 0))),
      };
    }),
    verification: {
      support_score: score,
      support_level:
        verification["support_level"] === "high" ||
        verification["support_level"] === "medium" ||
        verification["support_level"] === "low"
          ? verification["support_level"]
          : supportLevelFromScore(score),
      claims_total: asNumber(verification["claims_total"]),
      claims_supported: asNumber(verification["claims_supported"]),
      unsupported_claims: asStringList(verification["unsupported_claims"]),
      conflict_detected: asBoolean(verification["conflict_detected"]),
      conflict_summary: asNullableString(verification["conflict_summary"]),
      ambiguity_level: asLevel(verification["ambiguity_level"]),
      decision_reason: asString(verification["decision_reason"]),
    },
    processing: {
      latency_ms: asNumber(processing["latency_ms"]),
      model: asString(processing["model"]),
      mock_mode: asBoolean(processing["mock_mode"]),
      stages: asStringList(processing["stages"]),
    },
  };
}

/** Extracts FastAPI error detail (string or 422 validation list). */
function getErrorMessage(status: number, body: unknown): string {
  if (typeof body === "object" && body !== null && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) =>
          typeof item === "object" && item !== null && "msg" in item
            ? String((item as { msg: unknown }).msg)
            : "Invalid form input",
        )
        .join(". ");
    }
  }
  return `The request failed with status ${status}.`;
}

export async function askQuestion(
  req: AskRequest,
  signal?: AbortSignal,
): Promise<AskResponse> {
  // --- Mock path (VITE_USE_MOCK_API=true) -------------------------------
  if (USE_MOCK_API) {
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, 3200);
      signal?.addEventListener("abort", () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
    return buildMockResponse(req);
  }
  // ----------------------------------------------------------------------

  // Combine the caller's cancel signal with a 60s timeout. A timeout is
  // reported as a friendly ApiError, not as a user-initiated AbortError.
  const controller = new AbortController();
  const onUserAbort = () => controller.abort(signal?.reason);
  if (signal) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    signal.addEventListener("abort", onUserAbort, { once: true });
  }
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/v1/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: req.user_name.trim(),
        question: req.question.trim(),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) {
      throw new ApiError("The analysis took too long. Please try again.");
    }
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(
      "Could not reach the FloorGuide service. Check your network connection and try again.",
    );
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onUserAbort);
  }

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(getErrorMessage(res.status, body), res.status);
  }
  if (body === null) {
    throw new ApiError("The FloorGuide service returned an unreadable response.");
  }

  return normalizeAskResponse(body, req);
}
