import { useId, useState, type FormEvent } from "react";
import { Search, Eraser } from "lucide-react";

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

  const nameError = name.trim().length === 0 ? "Please enter your name." : null;
  const questionError =
    question.trim().length === 0
      ? "Please enter your plant question."
      : question.trim().length < MIN
        ? `Please provide at least ${MIN} characters.`
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
      className="rounded-lg border border-border bg-background p-6 shadow-card md:p-8"
    >
      <h2 id="ask-heading" className="sr-only">
        Submit a plant question
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <label
              htmlFor={nameId}
              className="block text-sm font-semibold text-foreground"
            >
              Name <span className="text-warning">*</span>
            </label>
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
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none"
            />
            {touched && nameError && (
              <p id={`${nameId}-error`} className="mt-1.5 text-xs font-medium text-warning">
                {nameError}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor={questionId}
                className="block text-sm font-semibold text-foreground"
              >
                Plant question <span className="text-warning">*</span>
              </label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {question.length}/{MAX}
              </span>
            </div>
            <textarea
              id={questionId}
              name="question"
              required
              rows={5}
              maxLength={MAX}
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Example: The CV-07 conveyor motor is overheating. Can I open the guard and inspect it without stopping the line?"
              aria-invalid={touched && !!questionError}
              aria-describedby={
                touched && questionError ? `${questionId}-error` : `${questionId}-hint`
              }
              className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none"
            />
            <p id={`${questionId}-hint`} className="mt-1.5 text-xs text-muted-foreground">
              Minimum {MIN} characters. Include equipment IDs and symptoms where possible.
            </p>
            {touched && questionError && (
              <p
                id={`${questionId}-error`}
                className="mt-1.5 text-xs font-medium text-warning"
              >
                {questionError}
              </p>
            )}
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Example questions
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => onQuestionChange(ex)}
                className="rounded-md border border-border bg-surface px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-maintenance-muted focus-visible:outline-none"
              >
                {ex}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 flex flex-wrap gap-3 border-t border-border pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Finding answer…" : "Find grounded answer"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTouched(false);
              onClear();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
