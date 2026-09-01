import {
  AlertTriangle,
  HelpCircle,
  PhoneCall,
  RotateCcw,
  Timer,
} from "lucide-react";
import type { AskResponse } from "@/types/floorguide";
import { SupportScore } from "./SupportScore";
import { SourceBadge } from "./SourceBadge";
import { EvidenceCard } from "./EvidenceCard";
import { VerificationSummary } from "./VerificationSummary";
import { FeedbackPanel } from "./FeedbackPanel";

const INSUFFICIENT =
  "The available documentation does not support a reliable answer. Please provide more detail or escalate to the appropriate plant specialist.";

export function ResultSection({
  result,
  onAskAnother,
}: {
  result: AskResponse;
  onAskAnother: () => void;
}) {
  const { answer, verification, evidence, routed_sources } = result;
  const insufficient =
    verification.support_level === "low" || evidence.length === 0 || !answer.summary;
  const latency = result.processing?.latency_ms;

  return (
    <div className="space-y-4">
      <section
        aria-labelledby="answer-heading"
        className="overflow-hidden rounded-xl border border-hairline bg-background shadow-panel"
      >
        <div className="flex flex-col gap-4 border-b border-hairline bg-surface/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
          <div className="min-w-0">
            <h2 id="answer-heading" className="text-lg font-bold text-primary">
              Recommended answer
            </h2>
            {result.intent && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Intent · </span>
                {result.intent}
              </p>
            )}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {routed_sources.map((rs) => (
                <SourceBadge key={rs.source} source={rs.source} short />
              ))}
              {typeof latency === "number" && (
                <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                  <Timer className="h-3 w-3" aria-hidden="true" />
                  {(latency / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>
          <SupportScore
            score={verification.support_score}
            level={verification.support_level}
            className="shrink-0"
          />
        </div>

        <div className="px-5 py-5 md:px-7 md:py-6">
          {insufficient && (
            <p className="mb-5 flex gap-2.5 rounded-lg border border-warning/35 bg-warning-surface px-4 py-3 text-sm leading-relaxed text-warning-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{INSUFFICIENT}</span>
            </p>
          )}

          {answer.summary && (
            <p className="border-l-2 border-primary pl-4 text-base font-semibold leading-relaxed text-foreground md:text-[17px]">
              {answer.summary}
            </p>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-5">
            {answer.actions.length > 0 && (
              <div className="lg:col-span-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Recommended actions
                </h3>
                <ol className="mt-2.5 space-y-px overflow-hidden rounded-lg border border-hairline">
                  {answer.actions.map((a, i) => (
                    <li
                      key={a}
                      className="flex gap-3 border-b border-hairline bg-background px-4 py-3 last:border-b-0"
                    >
                      <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold tabular-nums text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="space-y-4 lg:col-span-2">
              {answer.warnings.length > 0 && (
                <div
                  role="alert"
                  className="rounded-lg border border-warning/35 bg-warning-surface px-4 py-3.5"
                >
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.05em] text-warning-foreground">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    Safety warnings
                  </h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-warning-foreground">
                    {answer.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {answer.missing_information.length > 0 && (
                <div className="rounded-lg border border-hairline bg-surface/60 px-4 py-3.5">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.05em] text-foreground">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Missing information
                  </h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                    {answer.missing_information.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {answer.escalation && (
                <div className="rounded-lg border border-safety/35 bg-safety-muted px-4 py-3.5">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.05em] text-safety-foreground">
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    Escalation
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-safety-foreground">
                    {answer.escalation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {routed_sources.length > 0 && (
            <div className="mt-6 border-t border-hairline pt-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Why these sources
              </h3>
              <ul className="mt-2.5 grid gap-2 md:grid-cols-2">
                {routed_sources.map((rs) => (
                  <li
                    key={rs.source}
                    className="flex items-start gap-2.5 rounded-lg border border-hairline bg-surface/50 px-3.5 py-2.5"
                  >
                    <SourceBadge source={rs.source} short className="shrink-0" />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {rs.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="evidence-heading">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <h2 id="evidence-heading" className="text-sm font-bold text-primary">
            Supporting evidence
          </h2>
          <span className="text-xs font-medium text-muted-foreground">
            {evidence.length} citation{evidence.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="mt-2.5 space-y-2.5">
          {evidence.length === 0 ? (
            <p className="rounded-xl border border-hairline bg-background px-5 py-4 text-sm text-muted-foreground">
              No citations were returned for this question.
            </p>
          ) : (
            evidence.map((e) => (
              <EvidenceCard key={`${e.document_id}-${e.section}`} item={e} />
            ))
          )}
        </div>
      </section>

      <VerificationSummary verification={verification} />
      <FeedbackPanel />

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onAskAnother}
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Ask another question
        </button>
      </div>
    </div>
  );
}
