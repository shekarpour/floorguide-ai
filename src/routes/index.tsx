import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/floorguide/Header";
import { QuestionForm } from "@/components/floorguide/QuestionForm";
import { WorkflowProgress, WORKFLOW_STAGES } from "@/components/floorguide/WorkflowProgress";
import { ResultSection } from "@/components/floorguide/ResultSection";
import { ErrorPanel } from "@/components/floorguide/ErrorPanel";
import { askQuestion, USE_MOCK_API } from "@/lib/floorguide/api";
import type { AskResponse } from "@/types/floorguide";

const TITLE = "FloorGuide AI — Grounded answers for plant-floor decisions";
const DESCRIPTION =
  "FloorGuide AI routes plant-floor questions to safety, maintenance, and quality documentation and returns cited, evidence-supported answers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Phase = "idle" | "working" | "result" | "error";

function Index() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inFlight = useRef(false);

  // Sequential workflow stage animation while a request is in flight.
  useEffect(() => {
    if (phase !== "working") return;
    setStage(0);
    // Live requests take ~15–30s; pace the stages to stay honest.
    const timers = WORKFLOW_STAGES.map((_, i) =>
      setTimeout(() => setStage(i), i * 4000),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("working");
    setError(null);
    setResult(null);

    try {
      const res = await askQuestion(
        { user_name: name.trim(), question: question.trim() },
        controller.signal,
      );
      setResult(res);
      setPhase("result");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setPhase("idle");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while contacting the FloorGuide service.",
        );
        setPhase("error");
      }
    } finally {
      inFlight.current = false;
      abortRef.current = null;
    }
  }, [name, question]);

  const handleCancel = () => abortRef.current?.abort();

  const handleClear = () => {
    setName("");
    setQuestion("");
    setResult(null);
    setError(null);
    setPhase("idle");
  };

  const handleAskAnother = () => {
    setQuestion("");
    setResult(null);
    setError(null);
    setPhase("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />

      <main
        className={`mx-auto w-full px-5 py-6 md:px-8 ${
          phase === "idle" || phase === "error"
            ? "flex max-w-3xl flex-1 flex-col justify-center py-10"
            : "max-w-6xl space-y-4 md:py-9"
        }`}
      >
        {USE_MOCK_API && (
          <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/50 bg-safety-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-safety-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Mock mode · local sample data
          </p>
        )}

        {phase === "working" ? (
          <WorkflowProgress activeStage={stage} onCancel={handleCancel} />
        ) : phase === "result" && result ? (
          <ResultSection result={result} onAskAnother={handleAskAnother} />
        ) : (
          <>
            {phase === "error" && error && <ErrorPanel message={error} onRetry={run} />}
            <QuestionForm
              name={name}
              question={question}
              onNameChange={setName}
              onQuestionChange={setQuestion}
              onSubmit={run}
              onClear={handleClear}
              isSubmitting={false}
            />
          </>
        )}
      </main>

      <footer className="border-t border-hairline">
        <p className="mx-auto max-w-6xl px-5 py-4 text-center text-[11px] text-muted-foreground md:px-8">
          Demo with fictional Northstar Foods documentation — confirm critical actions with
          approved plant procedures.
        </p>
      </footer>
    </div>
  );
}
