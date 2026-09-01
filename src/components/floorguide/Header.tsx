import { Factory } from "lucide-react";
import { SourceBadge } from "./SourceBadge";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary"
            aria-hidden="true"
          >
            <Factory className="h-5.5 w-5.5 text-primary-foreground" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-primary md:text-2xl">
              FloorGuide<span className="text-accent"> AI</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Grounded answers for plant-floor decisions
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="inline-flex items-center gap-2 rounded-full border border-support-high/30 bg-support-high/8 px-3 py-1 text-xs font-semibold text-support-high">
            <span className="h-2 w-2 rounded-full bg-support-high" aria-hidden="true" />
            Knowledge sources online
          </p>
          <div className="flex flex-wrap gap-2">
            <SourceBadge source="safety" />
            <SourceBadge source="maintenance" />
            <SourceBadge source="quality" />
          </div>
        </div>
      </div>
    </header>
  );
}
