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
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(0,0,0,0.01)] transition-colors placeholder:text-muted-foreground/60 hover:border-primary/30 focus-visible:border-ring focus-visible:outline-none";

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
      className="rounded-xl border border-hairline bg-background p-5 shadow-card md:p-7"
    >
      <h2 id="ask-heading" className="sr-only">
        Submit a plant question
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={nameId} className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
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
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Recorded with the request for shift traceability.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor={questionId}
                className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground"
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
              rows={4}
              maxLength={MAX}
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Example: The CV-07 conveyor motor is overheating. Can I open the guard and inspect it without stopping the line?"
              aria-invalid={touched && !!questionError}
              aria-describedby={
                touched && questionError ? `${questionId}-error` : `${questionId}-hint`
              }
              className={`mt-2 resize-y leading-relaxed ${fieldClass}`}
            />
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
              <p id={`${questionId}-hint`} className="text-[11px] text-muted-foreground">
                Include equipment IDs and symptoms. Min {MIN} characters.
              </p>
              {touched && questionError && (
                <p id={`${questionId}-error`} className="text-[11px] font-semibold text-warning">
                  {questionError}
                </p>
              )}
            </div>
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Try
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => onQuestionChange(ex)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-left text-xs text-surface-foreground transition-colors hover:border-primary/35 hover:bg-maintenance-muted focus-visible:outline-none"
              >
                <CornerDownLeft
                  className="h-3 w-3 text-muted-foreground/70 transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
                {ex}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-hairline pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Working…" : "Find grounded answer"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTouched(false);
              onClear();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
