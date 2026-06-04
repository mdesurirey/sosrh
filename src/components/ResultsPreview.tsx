import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, TrendingUp, Clock, Euro, ArrowRight } from "lucide-react";
import type { ScoreResult } from "@/lib/scoring";

interface Props {
  result: ScoreResult;
  onUnlock: () => void;
}

function ScoreGauge({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;
  const color =
    score < 35 ? "hsl(0 70% 55%)" : score < 55 ? "hsl(38 90% 50%)" : score < 75 ? "hsl(210 90% 50%)" : "hsl(152 55% 40%)";

  return (
    <div className="relative w-56 h-56 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} stroke="hsl(var(--secondary))" strokeWidth="14" fill="none" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-navy tabular-nums">{display}</div>
        <div className="text-sm text-muted-foreground mt-1">sur 100</div>
      </div>
    </div>
  );
}

export default function ResultsPreview({ result, onUnlock }: Props) {
  return (
    <section className="min-h-screen bg-beige-soft/30 py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <p className="text-xs uppercase tracking-[0.18em] text-sky font-semibold mb-3">Votre score de maturité RH</p>
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">{result.label}</h1>
            <p className="text-muted-foreground">Voici un aperçu de votre niveau de structuration RH.</p>
          </div>

          {/* Score card */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elevated border border-border mb-6 animate-scale-in">
            <ScoreGauge score={result.total} />

            {/* Sub-scores preview */}
            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              {[
                { label: "Structuration des processus", value: result.subscores.processes },
                { label: "Conformité RH", value: result.subscores.compliance },
                { label: "Automatisation", value: result.subscores.automation },
                { label: "Organisation", value: result.subscores.organization },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-secondary/40">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-navy tabular-nums">{s.value}/100</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-navy rounded-full transition-all duration-700" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs preview */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-soft">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Clock className="w-4 h-4 text-sky" /> Temps administratif récupérable
              </div>
              <div className="text-3xl font-bold text-navy tabular-nums">
                {result.recoverableHours.toLocaleString("fr-FR")} <span className="text-base font-normal text-muted-foreground">h/an</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border shadow-soft">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Euro className="w-4 h-4 text-sky" /> Gain financier estimé
              </div>
              <div className="text-3xl font-bold text-navy tabular-nums">
                {result.potentialSavings.toLocaleString("fr-FR")} <span className="text-base font-normal text-muted-foreground">€/an</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-navy rounded-3xl p-8 lg:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-4">
                <TrendingUp className="w-3.5 h-3.5" /> Analyse complète disponible
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Débloquez votre rapport détaillé</h2>
              <p className="text-white/70 mb-7 max-w-lg mx-auto text-sm md:text-base">
                Analyse processus par processus, opportunités d'automatisation et recommandations personnalisées.
              </p>
              <Button
                onClick={onUnlock}
                size="lg"
                className="bg-white text-navy hover:bg-beige rounded-full px-7 h-12 font-medium gap-2 group"
              >
                <Lock className="w-4 h-4" />
                Débloquer mon rapport détaillé
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
