import { useState } from "react";
import { ChevronDown, ExternalLink, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceItem } from "@/types/floorguide";
import { getCitationUrl } from "@/lib/floorguide/api";
import { SourceBadge } from "./SourceBadge";

function relevanceLabel(r: number) {
  if (r >= 0.9) return "Strong";
  if (r >= 0.7) return "Good";
  return "Partial";
}

export function EvidenceCard({ item, defaultOpen }: { item: EvidenceItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const pct = Math.round((item.relevance ?? 0) * 100);
  const citationUrl = getCitationUrl(item);

  return (
    <article className="overflow-hidden rounded-xl border border-hairline bg-background shadow-card">
      <div className="flex w-full items-start gap-3 px-4 py-3 hover:bg-surface/70">
        <SourceBadge source={item.source} short className="mt-0.5 shrink-0" />
        <span className="min-w-0 flex-1">
          <a
            href={citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group inline-flex max-w-full items-center gap-1.5 truncate text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {item.document_title}
            <ExternalLink
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          </a>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            §{item.section} · {item.section_title} · {item.document_id}
          </span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2.5">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1 w-14 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
              {relevanceLabel(item.relevance ?? 0)} {pct}%
            </span>
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Hide excerpt" : "Show excerpt"}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        </span>
      </div>

      {open && (
        <div className="border-t border-hairline bg-surface/50 px-4 py-3.5">
          <blockquote className="flex gap-2.5 text-sm leading-relaxed text-foreground">
            <Quote
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span>{item.excerpt}</span>
          </blockquote>
          <a
            href={citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Explore source document
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}
