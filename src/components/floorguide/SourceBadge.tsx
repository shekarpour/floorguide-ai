import { ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { SourceKey } from "@/types/floorguide";

const CONFIG: Record<
  SourceKey,
  { label: string; short: string; icon: ComponentType<{ className?: string }>; className: string }
> = {
  safety: {
    label: "Safety Procedures",
    short: "Safety",
    icon: ShieldCheck,
    className: "bg-safety-muted text-safety-foreground border-safety/40",
  },
  maintenance: {
    label: "Maintenance Manuals",
    short: "Maintenance",
    icon: Wrench,
    className: "bg-maintenance-muted text-maintenance border-maintenance/25",
  },
  quality: {
    label: "Quality Standards",
    short: "Quality",
    icon: CheckCircle2,
    className: "bg-quality-muted text-quality-foreground border-quality/35",
  },
};

export function SourceBadge({
  source,
  short = false,
  className,
}: {
  source: SourceKey;
  short?: boolean;
  className?: string;
}) {
  const cfg = CONFIG[source];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
        cfg.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {short ? cfg.short : cfg.label}
    </span>
  );
}

export const sourceLabel = (s: SourceKey) => CONFIG[s].label;
export const sourceShortLabel = (s: SourceKey) => CONFIG[s].short;
export const sourceIcon = (s: SourceKey) => CONFIG[s].icon;
