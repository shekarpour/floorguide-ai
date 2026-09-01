import { AlertOctagon, RefreshCw } from "lucide-react";

export function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section
      role="alert"
      className="rounded-lg border border-warning/40 bg-warning-surface p-5 shadow-card md:p-6"
    >
      <h2 className="flex items-center gap-2 text-sm font-bold text-warning-foreground">
        <AlertOctagon className="h-4 w-4" aria-hidden="true" />
        Request failed
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-warning-foreground">{message}</p>
      <p className="mt-1 text-xs text-warning-foreground/80">
        Your question has been preserved below.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Retry request
      </button>
    </section>
  );
}
