import { BadgeCheck, AlertTriangle, Library, ListChecks } from "lucide-react";
import type { Verification } from "@/types/floorguide";
import { cn } from "@/lib/utils";

export function VerificationSummary({
  verification,
  sourcesConsulted,
  decisionReason,
}: {
  verification: Verification;
  sourcesConsulted: number;
  decisionReason?: string;
}) {
  const unsupported = verification.unsupported_claims.length;
  const ok =
    unsupported === 0 &&
    verification.claims_supported >= verification.claims_total &&
    !verification.conflict_detected;

  const items = [
    {
      icon: ListChecks,
      label: "Claims supported",
      value: `${verification.claims_supported} / ${verification.claims_total}`,
    },
    {
      icon: Library,
      label: "Sources consulted",
      value: `${sourcesConsulted}`,
    },
    {
      icon: unsupported ? AlertTriangle : BadgeCheck,
      label: "Unsupported",
      value: `${unsupported}`,
    },
  ];

  return (
    <section
      aria-labelledby="verification-heading"
      className="rounded-xl border border-hairline bg-background p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="verification-heading" className="text-sm font-bold text-primary">
          Why FloorGuide chose this response
        </h3>
        <p
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            ok
              ? "border-support-high/25 bg-support-high/8 text-support-high"
              : "border-warning/30 bg-warning-surface text-warning-foreground",
          )}
        >
          {ok ? (
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {ok ? "Fully grounded" : "Review required"}
        </p>
      </div>

      {(decisionReason || verification.decision_reason) && (
        <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {decisionReason && <p>{decisionReason}</p>}
          {verification.decision_reason && verification.decision_reason !== decisionReason && (
            <p>{verification.decision_reason}</p>
          )}
        </div>
      )}

      <dl className="mt-4 grid grid-cols-3 divide-x divide-hairline overflow-hidden rounded-lg border border-hairline">
        {items.map((it) => (
          <div key={it.label} className="bg-surface/60 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
              <it.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {it.label}
            </dt>
            <dd className="mt-1 text-lg font-bold tabular-nums text-foreground">{it.value}</dd>
          </div>
        ))}
      </dl>

      {unsupported > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-warning-foreground">
          {verification.unsupported_claims.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
