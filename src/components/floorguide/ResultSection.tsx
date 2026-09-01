import {
  AlertTriangle,
  HelpCircle,
  PhoneCall,
  RotateCcw,
  Target,
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

  return (
    <div className="space-y-5">
      <section
        aria-labelledby="answer-heading"
        className="overflow-hidden rounded-lg border border-border bg-background shadow-panel"
      >
        <div className="flex flex-col gap-5 border-b border-border bg-surface/70 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 id="answer-heading" className="text-lg font-bold text-primary md:text-xl">
              Recommended Answer
            </h2>
            {result.intent && (
              <p className="mt-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                <Target className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-foreground">Detected intent: </span>
                  {result.intent}
                </span>
              </p>
            )}
          </div>
          <SupportScore
            score={verification.support_score}
            level={verification.support_level}
          />
        </div>

        <div className="px-6 py-6 md:px-8">
          {routed_sources.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Documentation routed
              </h3>
              <ul className="mt-3 grid gap-2.5 md:grid-cols-2">
                {routed_sources.map((rs) => (
                  <li
                    key={rs.source}
                    className="flex flex-col gap-1.5 rounded-md border border-border bg-surface/50 px-4 py-3"
                  >
                    <SourceBadge source={rs.source} className="self-start" />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {rs.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insufficient && (
            <p className="mt-6 flex gap-2.5 rounded-md border border-warning/40 bg-warning-surface px-4 py-3 text-sm leading-relaxed text-warning-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{INSUFFICIENT}</span>
            </p>
          )}

          {answer.summary && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Direct answer
              </h3>
              <p className="mt-2 text-base font-semibold leading-relaxed text-foreground md:text-lg">
                {answer.summary}
              </p>
            </div>
          )}

          {answer.actions.length > 0 && (
            <div className="mt-7">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recommended actions
              </h3>
              <ol className="mt-3 space-y-2.5">
                {answer.actions.map((a, i) => (
                  <li key={a} className="flex gap-3 rounded-md border border-border px-4 py-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{a}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {answer.warnings.length > 0 && (
            <div
              role="alert"
              className="mt-7 rounded-md border border-warning/40 bg-warning-surface px-5 py-4"
            >
              <h3 className="flex items-center gap-2 text-sm font-bold text-warning-foreground">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Safety warnings
              </h3>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-warning-foreground">
                {answer.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.missing_information.length > 0 && (
            <div className="mt-7 rounded-md border border-border bg-surface/60 px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <HelpCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Missing information / clarification needed
              </h3>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                {answer.missing_information.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {answer.escalation && (
            <div className="mt-7 rounded-md border border-safety/40 bg-safety-muted px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-safety-foreground">
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Escalation guidance
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-safety-foreground">
                {answer.escalation}
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="text-base font-bold text-primary">
          Supporting evidence
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            {evidence.length} citation{evidence.length === 1 ? "" : "s"}
          </span>
        </h2>
        <div className="mt-3 space-y-3">
          {evidence.length === 0 ? (
            <p className="rounded-lg border border-border bg-background px-5 py-4 text-sm text-muted-foreground">
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
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Ask another question
        </button>
      </div>
    </div>
  );
}
