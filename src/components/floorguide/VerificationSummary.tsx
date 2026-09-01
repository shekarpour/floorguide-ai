import { BadgeCheck, AlertTriangle, Library, ListChecks } from "lucide-react";
import type { Verification } from "@/types/floorguide";
import { cn } from "@/lib/utils";

export function VerificationSummary({ verification }: { verification: Verification }) {
  const unsupported = verification.unsupported_claims.length;
  const ok = unsupported === 0 && verification.claims_supported >= verification.claims_total;

  const items = [
    {
      icon: ListChecks,
      label: "Claims supported",
      value: `${verification.claims_supported} of ${verification.claims_total} material claims supported`,
    },
    {
      icon: Library,
      label: "Sources consulted",
      value: `${verification.sources_consulted} documentation source${verification.sources_consulted === 1 ? "" : "s"} consulted`,
    },
    {
      icon: unsupported ? AlertTriangle : BadgeCheck,
      label: "Unsupported claims",
      value: unsupported
        ? `${unsupported} unsupported claim${unsupported === 1 ? "" : "s"} detected`
        : "No unsupported material claims detected",
    },
  ];

  return (
    <section
      aria-labelledby="verification-heading"
      className="rounded-lg border border-border bg-background p-5 shadow-card md:p-6"
    >
      <h3 id="verification-heading" className="text-sm font-bold text-primary">
        Verification summary
      </h3>
      <dl className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-md border border-border bg-surface/60 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <it.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {it.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{it.value}</dd>
          </div>
        ))}
      </dl>

      {unsupported > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-warning-foreground">
          {verification.unsupported_claims.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}

      <p
        className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold",
          ok
            ? "border-support-high/30 bg-support-high/8 text-support-high"
            : "border-warning/30 bg-warning-surface text-warning-foreground",
        )}
      >
        {ok ? (
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        )}
        Overall evidence status: {ok ? "Fully grounded in documentation" : "Review required"}
      </p>
    </section>
  );
}
