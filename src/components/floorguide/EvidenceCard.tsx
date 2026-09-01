import { useState } from "react";
import { ChevronDown, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceItem } from "@/types/floorguide";
import { SourceBadge } from "./SourceBadge";

function relevanceLabel(r: number) {
  if (r >= 0.9) return "Strong";
  if (r >= 0.7) return "Good";
  return "Partial";
}

export function EvidenceCard({
  item,
  defaultOpen,
}: {
  item: EvidenceItem;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const pct = Math.round((item.relevance ?? 0) * 100);

  return (
    <article className="overflow-hidden rounded-xl border border-hairline bg-background shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/70 focus-visible:outline-none"
      >
        <SourceBadge source={item.source} short className="mt-0.5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {item.document_title}
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            §{item.section} · {item.section_title} · {item.document_id}
          </span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2.5">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1 w-14 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
              {relevanceLabel(item.relevance ?? 0)} {pct}%
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {open && (
        <blockquote className="flex gap-2.5 border-t border-hairline bg-surface/50 px-4 py-3.5 text-sm leading-relaxed text-foreground">
          <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>{item.excerpt}</span>
        </blockquote>
      )}
    </article>
  );
}
