import { useId, useState, type FormEvent } from "react";
import { Search, Eraser, CornerDownLeft } from "lucide-react";

const EXAMPLES = [
  "Can I reach through the guard to clear a pouch jam?",
  "Why is the CV-07 conveyor belt drifting to one side?",
  "Can production restart after repairing an overheating conveyor?",
];

const MAX = 1000;
const MIN = 10;

export interface QuestionFormProps {
  name: string;
  question: string;
  onNameChange: (v: string) => void;
  onQuestionChange: (v: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isSubmitting: boolean;
}

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-[15px] text-foreground shadow-sm transition-all placeholder:text-muted-foreground/60 hover:border-primary/50 hover:bg-primary/[0.015] focus-visible:border-primary focus-visible:bg-primary/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function QuestionForm({
  name,
  question,
  onNameChange,
  onQuestionChange,
  onSubmit,
  onClear,
  isSubmitting,
}: QuestionFormProps) {
  const nameId = useId();
  const questionId = useId();
  const [touched, setTouched] = useState(false);

  const nameError = name.trim().length === 0 ? "Name required." : null;
  const questionError =
    question.trim().length === 0
      ? "Question required."
      : question.trim().length < MIN
        ? `At least ${MIN} characters.`
        : null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isSubmitting || nameError || questionError) return;
    onSubmit();
  };

  return (
    <section
      aria-labelledby="ask-heading"
      className="relative w-full overflow-hidden rounded-2xl border border-hairline bg-background p-6 shadow-panel md:p-9"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary to-accent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/[0.06] blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl">
        <h2
          id="ask-heading"
          className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]"
        >
          Ask the plant documentation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cited answers from safety, maintenance, and quality sources.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-7">
          {/* Name first — identifies the supervisor before the question */}
          <div className="max-w-xs">
            <div className="flex items-baseline justify-between gap-2">
              <label
                htmlFor={nameId}
                className="text-xs font-semibold uppercase tracking-[0.06em] text-primary"
              >
                Name
              </label>
              {touched && nameError && (
                <span id={`${nameId}-error`} className="text-[11px] font-semibold text-warning">
                  {nameError}
                </span>
              )}
            </div>
            <input
              id={nameId}
              name="user_name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name"
              aria-invalid={touched && !!nameError}
              aria-describedby={touched && nameError ? `${nameId}-error` : undefined}
              className={`mt-2 ${fieldClass}`}
            />
          </div>

          {/* Question — the primary focus */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor={questionId}
                className="text-xs font-semibold uppercase tracking-[0.06em] text-primary"
              >
                Plant question
              </label>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {question.length}/{MAX}
              </span>
            </div>
            <textarea
              id={questionId}
              name="question"
              required
              autoFocus
              rows={6}
              maxLength={MAX}
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="The CV-07 conveyor motor is overheating. Can I open the guard and inspect it without stopping the line?"
              aria-invalid={touched && !!questionError}
              aria-describedby={touched && questionError ? `${questionId}-error` : undefined}
              className={`mt-2 resize-y text-base leading-relaxed ${fieldClass}`}
            />
            {touched && questionError && (
              <p id={`${questionId}-error`} className="mt-1.5 text-xs font-semibold text-warning">
                {questionError}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setTouched(false);
                onClear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none"
            >
              <Eraser className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-panel focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Working…" : "Find grounded answer"}
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 border-t border-hairline pt-5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => onQuestionChange(ex)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-left text-xs text-surface-foreground transition-colors hover:border-accent/60 hover:bg-safety-muted focus-visible:outline-none"
              >
                <CornerDownLeft
                  className="h-3 w-3 text-muted-foreground/70 transition-colors group-hover:text-safety-foreground"
                  aria-hidden="true"
                />
                {ex}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
