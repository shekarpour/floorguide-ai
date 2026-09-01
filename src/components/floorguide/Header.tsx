import { Factory } from "lucide-react";
import { SourceBadge } from "./SourceBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3.5 md:px-8">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary"
            aria-hidden="true"
          >
            <Factory className="h-4.5 w-4.5 text-primary-foreground" />
          </span>
          <div className="leading-tight">
            <h1 className="text-[17px] font-bold tracking-tight text-primary">
              FloorGuide<span className="text-accent"> AI</span>
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground">
              Grounded answers for plant-floor decisions
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-support-high/25 bg-support-high/8 px-2.5 py-1 text-[11px] font-semibold text-support-high">
            <span className="h-1.5 w-1.5 rounded-full bg-support-high" aria-hidden="true" />
            Sources online
          </span>
          <span className="hidden h-4 w-px bg-hairline sm:block" aria-hidden="true" />
          <SourceBadge source="safety" short />
          <SourceBadge source="maintenance" short />
          <SourceBadge source="quality" short />
        </div>
      </div>
    </header>
  );
}
