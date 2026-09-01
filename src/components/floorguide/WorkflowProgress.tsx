import { Check, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const WORKFLOW_STAGES = [
  { title: "Understanding intent", status: "Classifying the operational intent" },
  { title: "Selecting documentation", status: "Routing to Safety and Maintenance" },
  { title: "Retrieving evidence", status: "Reviewing relevant document sections" },
  { title: "Verifying answer", status: "Checking citation and evidence coverage" },
] as const;

export function WorkflowProgress({
  activeStage,
  onCancel,
}: {
  activeStage: number;
  onCancel: () => void;
}) {
  const pct = Math.min(100, ((activeStage + 1) / WORKFLOW_STAGES.length) * 100);

  return (
    <section
      aria-labelledby="workflow-heading"
      aria-live="polite"
      className="rounded-xl border border-hairline bg-background p-5 shadow-card md:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="workflow-heading" className="text-sm font-bold text-primary">
          Building a grounded answer
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            Step {activeStage + 1} of {WORKFLOW_STAGES.length} ·{" "}
            {WORKFLOW_STAGES[activeStage]?.status}
          </span>
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none"
        >
          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Cancel
        </button>
      </div>

      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={WORKFLOW_STAGES.length}
        aria-valuenow={activeStage + 1}
        aria-label="Workflow progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STAGES.map((stage, i) => {
          const done = i < activeStage;
          const active = i === activeStage;
          return (
            <li
              key={stage.title}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors",
                done && "border-support-high/25 bg-support-high/6",
                active && "border-primary/30 bg-maintenance-muted",
                !done && !active && "border-hairline bg-surface/60",
              )}
            >
              <span className="shrink-0" aria-hidden="true">
                {done ? (
                  <Check className="h-4 w-4 text-support-high" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <span className="block h-4 w-4 rounded-full border border-input" />
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  done || active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {stage.title}
                <span className="sr-only">
                  {done ? " — complete" : active ? " — in progress" : " — pending"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
