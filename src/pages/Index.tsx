import { useState, useCallback } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Landing from "@/components/Landing";
import Questionnaire from "@/components/Questionnaire";
import ResultsPreview from "@/components/ResultsPreview";
import LeadForm, { type LeadData } from "@/components/LeadForm";
import DetailedReport from "@/components/DetailedReport";
import { calculate, trackEvent, type Answers, type ScoreResult } from "@/lib/scoring";

type Stage = "landing" | "quiz" | "results" | "lead" | "report";

export default function Index() {
  const [stage, setStage] = useState<Stage>("landing");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const go = (s: Stage) => {
    setStage(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStart = useCallback(() => {
    trackEvent("quiz_started");
    go("quiz");
  }, []);

  const handleQuizComplete = useCallback((a: Answers) => {
    const r = calculate(a);
    setAnswers(a);
    setResult(r);
    trackEvent("quiz_completed", { score: r.total });
    go("results");
  }, []);

  const handleUnlock = useCallback(() => {
    trackEvent("lead_form_viewed");
    go("lead");
  }, []);

  const handleLeadSubmit = useCallback((_d: LeadData) => {
    go("report");
  }, []);

  const handleReset = useCallback(() => {
    setAnswers(null);
    setResult(null);
    go("landing");
  }, []);

  if (stage === "quiz") {
    return <Questionnaire onComplete={handleQuizComplete} onExit={() => go("landing")} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader onStart={handleStart} />
      <main className="flex-1">
        {stage === "landing" && <Landing onStart={handleStart} />}
        {stage === "results" && result && <ResultsPreview result={result} onUnlock={handleUnlock} />}
        {stage === "lead" && (
          <LeadForm
            onSubmit={handleLeadSubmit}
            context={{ ...answers, score: result?.total } as Record<string, unknown>}
          />
        )}
        {stage === "report" && result && answers && (
          <DetailedReport result={result} answers={answers} onReset={handleReset} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
