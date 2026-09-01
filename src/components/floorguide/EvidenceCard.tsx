import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceItem } from "@/types/floorguide";
import { SourceBadge, sourceLabel } from "./SourceBadge";

function relevanceLabel(r: number) {
  if (r >= 0.9) return "Strong match";
  if (r >= 0.7) return "Good match";
  return "Partial match";
}

export function EvidenceCard({ item, defaultOpen }: { item: EvidenceItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const pct = Math.round(item.relevance * 100);

  return (
    <article className="rounded-lg border border-border bg-background shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-lg px-4 py-4 text-left transition-colors hover:bg-surface/70 focus-visible:outline-none md:px-5"
      >
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <SourceBadge source={item.source} short />
            <span className="text-xs text-muted-foreground">{item.document_id}</span>
          </span>
          <span className="mt-1.5 block text-sm font-semibold text-foreground">
            {sourceLabel(item.source)} — Section {item.section}: {item.section_title}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {item.document_title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-border px-4 py-4 md:px-5">
          <blockquote className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-foreground">
            “{item.excerpt}”
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Relevance
            </span>
            <span className="h-1.5 w-28 overflow-hidden rounded-full bg-surface">
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {pct}% · {relevanceLabel(item.relevance)}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
