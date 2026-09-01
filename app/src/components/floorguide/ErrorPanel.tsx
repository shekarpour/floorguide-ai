import { AlertOctagon, RefreshCw } from "lucide-react";

export function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section
      role="alert"
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-warning/35 bg-warning-surface px-5 py-4"
    >
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-sm font-bold text-warning-foreground">
          <AlertOctagon className="h-4 w-4" aria-hidden="true" />
          Request failed
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-warning-foreground">{message}</p>
        <p className="mt-0.5 text-xs text-warning-foreground/80">Your question is preserved.</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Retry
      </button>
    </section>
  );
}
