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
      <section className="rounded-lg border border-support-high/30 bg-support-high/8 p-5 md:p-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-support-high">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Thank you — your feedback was recorded for this session.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="feedback-heading"
      className="rounded-lg border border-border bg-background p-5 shadow-card md:p-6"
    >
      <h3 id="feedback-heading" className="text-sm font-bold text-primary">
        Was this answer appropriate for the situation?
      </h3>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setVerdict("approved")}
          className="inline-flex items-center gap-2 rounded-md border border-support-high/40 bg-support-high/8 px-4 py-2 text-sm font-semibold text-support-high transition-colors hover:bg-support-high/15 focus-visible:outline-none"
        >
          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
          Approve answer
        </button>
        <button
          type="button"
          onClick={() => setVerdict("needs_correction")}
          aria-expanded={verdict === "needs_correction"}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none",
            verdict === "needs_correction"
              ? "border-warning/50 bg-warning-surface text-warning-foreground"
              : "border-input bg-background text-foreground hover:bg-surface",
          )}
        >
          <Flag className="h-4 w-4" aria-hidden="true" />
          Needs correction
        </button>
      </div>

      {verdict === "needs_correction" && (
        <div className="mt-5 border-t border-border pt-5">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reasons (optional)
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-foreground hover:border-primary/35"
                >
                  <input
                    type="checkbox"
                    checked={reasons.includes(r.value)}
                    onChange={() => toggle(r.value)}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor={commentsId}
            className="mt-5 block text-sm font-semibold text-foreground"
          >
            Comments (optional)
          </label>
          <textarea
            id={commentsId}
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Describe what should be corrected."
            className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none"
          />

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none"
          >
            Submit feedback
          </button>
        </div>
      )}
    </section>
  );
}
