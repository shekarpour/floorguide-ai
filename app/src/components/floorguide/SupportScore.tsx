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
  const r = 30;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-xl border border-hairline bg-background px-4 py-3",
        className,
      )}
    >
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90" aria-hidden="true">
          <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={cfg.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-base font-bold tabular-nums text-foreground">
          {clamped}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          Evidence support
        </p>
        <p className={cn("text-sm font-bold", cfg.text)}>{cfg.label}</p>
        <p className="mt-0.5 max-w-[15rem] text-[11px] leading-snug text-muted-foreground">
          Documentation support, not a probability of correctness.
        </p>
      </div>
    </div>
  );
}
