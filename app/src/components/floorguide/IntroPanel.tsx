import { Brain, FolderSearch, Quote, ShieldCheck, Info } from "lucide-react";

const STEPS = [
  { icon: Brain, label: "Intent" },
  { icon: FolderSearch, label: "Routing" },
  { icon: Quote, label: "Evidence" },
  { icon: ShieldCheck, label: "Verification" },
];

export function IntroPanel() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="rounded-xl border border-hairline bg-background px-5 py-5 shadow-card md:px-7"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 id="intro-heading" className="text-lg font-bold text-primary">
            Ask the right documentation
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Intent detection, source routing, and citation checks — one cited answer.
          </p>
        </div>

        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-xs font-semibold text-surface-foreground">
                <s.icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-muted-foreground/50" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-4 flex gap-2 border-t border-hairline pt-3.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-px h-3.5 w-3.5 shrink-0 text-safety" aria-hidden="true" />
        <span>
          Demonstration system using fictional Northstar Foods documentation. Confirm critical
          actions with approved plant procedures.
        </span>
      </p>
    </section>
  );
}
