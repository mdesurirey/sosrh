import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Euro,
  TrendingUp,
  Phone,
  ArrowRight,
  UserPlus,
  FileSignature,
  RefreshCw,
  UserMinus,
  AlertOctagon,
  Scale,
  CalendarClock,
  FolderOpen,
  History,
  RotateCcw,
} from "lucide-react";
import type { ScoreResult, Answers } from "@/lib/scoring";
import { trackEvent } from "@/lib/scoring";

interface Props {
  result: ScoreResult;
  answers: Answers;
  onReset: () => void;
}

function levelFor(score: number, weight: number): { label: string; tone: string } {
  // Convert sub-score-ish to a level
  const s = score;
  if (s < 40) return { label: "À structurer", tone: "bg-red-50 text-red-700 border-red-200" };
  if (s < 65) return { label: "En cours", tone: "bg-amber-50 text-amber-700 border-amber-200" };
  if (s < 85) return { label: "Structuré", tone: "bg-sky-soft text-[hsl(212,90%,30%)] border-[hsl(210,80%,85%)]" };
  return { label: "Optimisé", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

function ProcessRow({ icon: Icon, title, score }: { icon: any; title: string; score: number }) {
  const lvl = levelFor(score, 1);
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-navy" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-navy truncate">{title}</div>
          <div className="text-xs text-muted-foreground">{score}/100</div>
        </div>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${lvl.tone}`}>{lvl.label}</span>
    </div>
  );
}

export default function DetailedReport({ result, answers, onReset }: Props) {
  const handleDemo = () => {
    trackEvent("demo_requested");
    window.open("https://www.legipilot.com", "_blank");
  };

  // Derive per-process scores from sub-scores
  const p = result.subscores.processes;
  const c = result.subscores.compliance;
  const a = result.subscores.automation;
  const processes = [
    { icon: UserPlus, title: "Recrutement", score: Math.round((p + a) / 2) },
    { icon: FileSignature, title: "Contrats", score: Math.round((p + c) / 2) },
    { icon: RefreshCw, title: "Avenants & modifications", score: Math.round(p * 0.6 + a * 0.4) },
    { icon: UserMinus, title: "Départs", score: Math.round((p + c) / 2 - 5) },
    { icon: AlertOctagon, title: "Disciplinaire", score: Math.max(20, Math.round(c - 10)) },
  ];
  const compliance = [
    { icon: Scale, title: "Obligations légales", score: c },
    { icon: CalendarClock, title: "Échéances RH", score: Math.round((c + a) / 2) },
    { icon: FolderOpen, title: "Documentation", score: Math.round((c + p) / 2) },
    { icon: History, title: "Traçabilité", score: Math.round((c + a) / 2 - 5) },
  ];

  const recommendations: string[] = [];
  if (result.subscores.processes < 60)
    recommendations.push("Standardiser les procédures clés (recrutement, avenants, départs) avec des modèles juridiquement conformes.");
  if (result.subscores.compliance < 65)
    recommendations.push("Mettre en place un suivi automatisé des échéances légales et des obligations RH récurrentes.");
  if (result.subscores.automation < 60)
    recommendations.push("Centraliser les opérations RH dans un outil unique pour éliminer les ressaisies et les pertes d'information.");
  if (result.subscores.organization < 60)
    recommendations.push("Industrialiser les événements à fort volume (entrées/sorties) avec des workflows pré-configurés.");
  recommendations.push("Fiabiliser la traçabilité des décisions RH pour sécuriser un éventuel contrôle ou contentieux.");

  return (
    <section className="min-h-screen bg-beige-soft/30 py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-4 animate-fade-in-up">
            <p className="text-xs uppercase tracking-[0.18em] text-sky font-semibold mb-3">Rapport détaillé</p>
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Votre analyse complète</h1>
            <p className="text-muted-foreground">Maturité RH, gains potentiels et plan d'action.</p>
          </div>

          {/* Global score */}
          <div className="bg-white rounded-3xl p-8 shadow-card border border-border">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Score global</div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-navy tabular-nums">{result.total}</span>
                  <span className="text-lg text-muted-foreground">/ 100</span>
                </div>
                <div className="text-navy font-medium">{result.label}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:w-1/2">
                {[
                  ["Processus", result.subscores.processes],
                  ["Conformité", result.subscores.compliance],
                  ["Automatisation", result.subscores.automation],
                  ["Organisation", result.subscores.organization],
                ].map(([l, v]) => (
                  <div key={l as string} className="p-3 rounded-xl bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">{l}</div>
                    <div className="font-semibold text-navy tabular-nums">{v}/100</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Processes */}
          <div className="bg-white rounded-3xl p-7 lg:p-8 shadow-card border border-border">
            <h2 className="text-xl font-semibold text-navy mb-2">Analyse des processus RH</h2>
            <p className="text-sm text-muted-foreground mb-4">Niveau de structuration de vos opérations RH clés.</p>
            <div>
              {processes.map((row) => (
                <ProcessRow key={row.title} {...row} />
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-3xl p-7 lg:p-8 shadow-card border border-border">
            <h2 className="text-xl font-semibold text-navy mb-2">Analyse conformité</h2>
            <p className="text-sm text-muted-foreground mb-4">Maîtrise de vos obligations et de votre documentation RH.</p>
            <div>
              {compliance.map((row) => (
                <ProcessRow key={row.title} {...row} />
              ))}
            </div>
          </div>

          {/* Gains */}
          <div className="bg-white rounded-3xl p-7 lg:p-8 shadow-card border border-border">
            <h2 className="text-xl font-semibold text-navy mb-5">Gains potentiels</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="p-5 rounded-2xl bg-sky-soft/50 border border-[hsl(210,80%,90%)]">
                <div className="flex items-center gap-2 text-sm text-[hsl(212,90%,30%)] mb-2">
                  <Clock className="w-4 h-4" /> Temps économisable
                </div>
                <div className="text-3xl font-bold text-navy tabular-nums">
                  {result.recoverableHours.toLocaleString("fr-FR")} <span className="text-base font-normal text-muted-foreground">h/an</span>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-beige-soft border border-[hsl(36,30%,82%)]">
                <div className="flex items-center gap-2 text-sm text-[hsl(36,50%,30%)] mb-2">
                  <Euro className="w-4 h-4" /> Économie annuelle estimée
                </div>
                <div className="text-3xl font-bold text-navy tabular-nums">
                  {result.potentialSavings.toLocaleString("fr-FR")} <span className="text-base font-normal text-muted-foreground">€/an</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/40 text-sm text-muted-foreground leading-relaxed">
              <strong className="text-navy">Opportunités d'automatisation :</strong> recrutement, génération et signature
              de contrats, gestion des avenants, processus de départ, suivi des échéances légales et entretiens obligatoires.
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-3xl p-7 lg:p-8 shadow-card border border-border">
            <h2 className="text-xl font-semibold text-navy mb-5">Recommandations</h2>
            <ul className="space-y-3">
              {recommendations.slice(0, 5).map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Final CTA */}
          <div className="bg-navy rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-5">
                <TrendingUp className="w-3.5 h-3.5" /> Aller plus loin
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Découvrez comment LégiPilot automatise vos opérations RH
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
                LégiPilot centralise vos processus RH, automatise vos démarches administratives
                et sécurise votre conformité légale.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleDemo}
                  size="lg"
                  className="bg-white text-navy hover:bg-beige rounded-full px-7 h-12 font-medium gap-2 group"
                >
                  <Phone className="w-4 h-4" />
                  Être rappelé par un expert LégiPilot
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-full px-6 h-12 text-white hover:bg-white/10 hover:text-white gap-2"
                >
                  <a href="https://www.legipilot.com" target="_blank" rel="noopener noreferrer">
                    Découvrir la plateforme
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refaire l'évaluation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
