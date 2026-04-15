import { useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";
import CalculatorForm from "@/components/CalculatorForm";
import ResultsPreview from "@/components/ResultsPreview";
import LeadForm, { type LeadData } from "@/components/LeadForm";
import DetailedReport from "@/components/DetailedReport";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { calculateResults, type CalculatorInputs, type CalculatorResults } from "@/lib/calculator";

type Stage = "landing" | "results" | "report";

export default function Index() {
  const [stage, setStage] = useState<Stage>("landing");
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleStartCalculator = () => {
    scrollTo(calcRef);
  };

  const handleHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCalculatorSubmit = useCallback((data: CalculatorInputs) => {
    setInputs(data);
    const r = calculateResults(data);
    setResults(r);
    setStage("results");
    scrollTo(resultsRef);
  }, []);

  const handleLeadSubmit = useCallback((_data: LeadData) => {
    setStage("report");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleReset = useCallback(() => {
    setStage("landing");
    setInputs(null);
    setResults(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            Légi<span className="text-gradient">Pilot</span>
          </span>
          <a
            href="https://www.legipilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            legipilot.com
          </a>
        </div>
      </header>

      {stage !== "report" && (
        <>
          <HeroSection onStartCalculator={handleStartCalculator} onHowItWorks={handleHowItWorks} />
          <WhySection />
          <div ref={calcRef}>
            <CalculatorForm onSubmit={handleCalculatorSubmit} />
          </div>
        </>
      )}

      {stage === "results" && results && (
        <div ref={resultsRef}>
          <ResultsPreview results={results} />
          <LeadForm
            onSubmit={handleLeadSubmit}
            calculatorData={inputs as unknown as Record<string, unknown>}
          />
        </div>
      )}

      {stage === "report" && results && inputs && (
        <DetailedReport results={results} inputs={inputs} onReset={handleReset} />
      )}

      <SocialProof />
      <FAQ />
      <Footer />
    </div>
  );
}
