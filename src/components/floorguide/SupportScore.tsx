import type { SupportLevel } from "@/types/floorguide";
import { cn } from "@/lib/utils";

const LEVELS: Record<SupportLevel, { label: string; color: string; text: string }> = {
  high: { label: "High support", color: "var(--support-high)", text: "text-support-high" },
  medium: {
    label: "Medium support",
    color: "var(--support-medium)",
    text: "text-support-medium",
  },
  low: { label: "Low support", color: "var(--support-low)", text: "text-support-low" },
};

export function SupportScore({
  score,
  level,
  className,
}: {
  score: number;
  level: SupportLevel;
  className?: string;
}) {
  const cfg = LEVELS[level];
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden="true">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={cfg.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums text-foreground">
          {score}
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Evidence support score
        </p>
        <p className={cn("text-sm font-bold", cfg.text)}>
          {cfg.label} · {score}/100
        </p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
          This score reflects support from the available documentation, not a statistical
          probability of correctness.
        </p>
      </div>
    </div>
  );
}
