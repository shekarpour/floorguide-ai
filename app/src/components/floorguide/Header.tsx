import { Factory } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 md:px-8">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-card"
          aria-hidden="true"
        >
          <Factory className="h-4 w-4 text-primary-foreground" />
        </span>
        <h1 className="text-[16px] font-bold tracking-tight text-foreground">
          FloorGuide <span className="text-primary">AI</span>
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-support-high/25 bg-support-high/8 px-2.5 py-1 text-[11px] font-semibold text-support-high">
            <span className="h-1.5 w-1.5 rounded-full bg-support-high" aria-hidden="true" />
            Sources online
          </span>
        </div>
      </div>
    </header>
  );
}
