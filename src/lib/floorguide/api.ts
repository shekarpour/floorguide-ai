/**
 * FloorGuide AI — API service.
 *
 * The only module that talks to the FastAPI backend. No AI keys live here:
 * all model access happens server-side.
 */
import type { AskRequest, AskResponse, SourceKey } from "@/types/floorguide";
import { supportLevelFromScore } from "@/types/floorguide";
import { buildMockResponse } from "./mock-response";

const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";
const MOCK_FLAG = import.meta.env["VITE_USE_MOCK_API"] as string | undefined;
/** Mock mode: explicit opt-in, or implicit when no backend URL is configured. */
export const USE_MOCK_API = MOCK_FLAG === "true" || (MOCK_FLAG !== "false" && !API_BASE_URL);

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
const asNumber = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const asSource = (v: unknown): SourceKey =>
  VALID_SOURCES.includes(v as SourceKey) ? (v as SourceKey) : "safety";

/**
 * Defensive normalizer: tolerates malformed or partial payloads so the UI
 * never crashes on an unexpected backend response.
 */
export function normalizeAskResponse(raw: unknown, req: AskRequest): AskResponse {
  const r = (raw ?? {}) as Record<string, unknown>;
  const answer = (r["answer"] ?? {}) as Record<string, unknown>;
  const verification = (r["verification"] ?? {}) as Record<string, unknown>;

  const score = Math.max(0, Math.min(100, asNumber(verification["support_score"], 0)));

  return {
    request_id: asString(r["request_id"], `req_${Date.now()}`),
    user_name: asString(r["user_name"], req.user_name),
    question: asString(r["question"], req.question),
    intent: asString(r["intent"]),
    routed_sources: asArray(r["routed_sources"]).map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return { source: asSource(o["source"]), reason: asString(o["reason"]) };
    }),
    answer: {
      summary: asString(answer["summary"]),
      actions: asArray(answer["actions"]).map((a) => asString(a)).filter(Boolean),
      warnings: asArray(answer["warnings"]).map((a) => asString(a)).filter(Boolean),
      missing_information: asArray(answer["missing_information"])
        .map((a) => asString(a))
        .filter(Boolean),
      escalation: asString(answer["escalation"]),
    },
    evidence: asArray(r["evidence"]).map((e) => {
      const o = (e ?? {}) as Record<string, unknown>;
      return {
        source: asSource(o["source"]),
        document_id: asString(o["document_id"]),
        document_title: asString(o["document_title"], "Untitled document"),
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
      unsupported_claims: asArray(verification["unsupported_claims"])
        .map((c) => asString(c))
        .filter(Boolean),
      sources_consulted: asNumber(verification["sources_consulted"]),
    },
    processing: {
      latency_ms: asNumber(
        ((r["processing"] ?? {}) as Record<string, unknown>)["latency_ms"],
      ),
    },
  };
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

  if (!API_BASE_URL) {
    throw new ApiError(
      "VITE_API_BASE_URL is not configured. Set it in your .env file or enable VITE_USE_MOCK_API.",
    );
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/v1/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: signal ?? null,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(
      "Could not reach the FloorGuide service. Check your network connection and try again.",
    );
  }

  if (!res.ok) {
    throw new ApiError(
      `The FloorGuide service returned an error (${res.status}). Please retry.`,
      res.status,
    );
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new ApiError("The FloorGuide service returned an unreadable response.");
  }

  return normalizeAskResponse(payload, req);
}
