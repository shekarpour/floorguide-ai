import { Info } from "lucide-react";

export function IntroPanel() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="rounded-lg border border-border bg-background p-6 shadow-card md:p-8"
    >
      <h2 id="intro-heading" className="text-lg font-bold text-primary md:text-xl">
        Ask the right documentation
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
        FloorGuide identifies your question&apos;s intent, consults the relevant plant
        documentation, and produces a cited, evidence-supported answer.
      </p>
      <p className="mt-5 flex gap-2.5 rounded-md border border-safety/35 bg-safety-muted px-4 py-3 text-xs leading-relaxed text-safety-foreground md:text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Demonstration system using fictional Northstar Foods documentation. Confirm
          critical actions with approved plant procedures.
        </span>
      </p>
    </section>
  );
}
