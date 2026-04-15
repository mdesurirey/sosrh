import { useEffect, useRef, useState } from "react";
import { Clock, DollarSign, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import type { CalculatorResults } from "@/lib/calculator";

interface Props {
  results: CalculatorResults;
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(value * eased);
      setDisplayed(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayed.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

function MaturityGauge({ score, level }: { score: number; level: string }) {
  const getColor = () => {
    if (score < 35) return "text-destructive";
    if (score < 65) return "text-warning";
    return "text-success";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-16 overflow-hidden">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 141.37} 141.37`}
            className={`${getColor()} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          <span className={`text-xl font-bold ${getColor()}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{level}</span>
    </div>
  );
}

const cards = [
  {
    icon: Clock,
    label: "Temps RH annuel estimé",
    key: "totalAnnualHours" as const,
    suffix: " h/an",
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    icon: DollarSign,
    label: "Coût interne annuel",
    key: "annualCost" as const,
    suffix: " €/an",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: TrendingDown,
    label: "Heures récupérables",
    key: "recoverableHours" as const,
    suffix: " h/an",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: TrendingUp,
    label: "Économie potentielle",
    key: "potentialSavings" as const,
    prefix: "",
    suffix: " €/an",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export default function ResultsPreview({ results }: Props) {
  return (
    <section id="results" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Vos résultats</h2>
            <p className="text-muted-foreground">
              Voici une estimation de l'impact de votre gestion RH actuelle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {cards.map((card, i) => (
              <div
                key={card.key}
                className="bg-card rounded-xl shadow-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold">
                  <AnimatedNumber value={results[card.key]} suffix={card.suffix} prefix={card.prefix || ""} />
                </p>
              </div>
            ))}
          </div>

          {/* Maturity */}
          <div className="bg-card rounded-xl shadow-card p-6 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">Niveau de maturité RH</span>
            </div>
            <MaturityGauge score={results.maturityScore} level={results.maturityLevel} />
          </div>

          {/* Insight */}
          <div className="mt-6 p-4 rounded-lg bg-accent/50 border border-border text-sm text-muted-foreground text-center">
            Cette estimation est indicative et vise à donner un ordre de grandeur réaliste.
          </div>
        </div>
      </div>
    </section>
  );
}
