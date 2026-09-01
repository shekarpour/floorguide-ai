import { useId, useState } from "react";
import { ThumbsUp, Flag, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedbackReason } from "@/types/floorguide";

const REASONS: { value: FeedbackReason; label: string }[] = [
  { value: "incorrect_source", label: "Incorrect source" },
  { value: "incomplete_answer", label: "Incomplete answer" },
  { value: "potentially_unsafe", label: "Potentially unsafe" },
  { value: "unclear", label: "Unclear" },
  { value: "other", label: "Other" },
];

export function FeedbackPanel() {
  const commentsId = useId();
  const [verdict, setVerdict] = useState<"approved" | "needs_correction" | null>(null);
  const [reasons, setReasons] = useState<FeedbackReason[]>([]);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggle = (r: FeedbackReason) =>
    setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  if (submitted || verdict === "approved") {
    return (
      <section className="rounded-xl border border-support-high/25 bg-support-high/8 px-5 py-4">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-support-high">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Feedback recorded for this session.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="feedback-heading"
      className="rounded-xl border border-hairline bg-background p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="feedback-heading" className="text-sm font-bold text-primary">
          Was this answer appropriate for the situation?
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setVerdict("approved")}
            className="inline-flex items-center gap-2 rounded-lg border border-support-high/35 bg-support-high/8 px-3.5 py-2 text-sm font-semibold text-support-high transition-colors hover:bg-support-high/15 focus-visible:outline-none"
          >
            <ThumbsUp className="h-4 w-4" aria-hidden="true" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => setVerdict("needs_correction")}
            aria-expanded={verdict === "needs_correction"}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none",
              verdict === "needs_correction"
                ? "border-warning/45 bg-warning-surface text-warning-foreground"
                : "border-input bg-background text-foreground hover:bg-surface",
            )}
          >
            <Flag className="h-4 w-4" aria-hidden="true" />
            Needs correction
          </button>
        </div>
      </div>

      {verdict === "needs_correction" && (
        <div className="mt-4 border-t border-hairline pt-4">
          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Reason (optional)
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    reasons.includes(r.value)
                      ? "border-primary/40 bg-maintenance-muted text-foreground"
                      : "border-hairline bg-surface/60 text-muted-foreground hover:border-primary/30",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={reasons.includes(r.value)}
                    onChange={() => toggle(r.value)}
                    className="h-3.5 w-3.5 accent-[var(--primary)]"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor={commentsId}
            className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
          >
            Comments (optional)
          </label>
          <textarea
            id={commentsId}
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="What should be corrected?"
            className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:outline-none"
          />

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="mt-3.5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            Submit feedback
          </button>
        </div>
      )}
    </section>
  );
}
