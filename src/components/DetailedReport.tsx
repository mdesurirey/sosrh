import { Button } from "@/components/ui/button";
import type { CalculatorResults, CalculatorInputs } from "@/lib/calculator";
import { getBusinessInsight, getRecommendations, trackEvent } from "@/lib/calculator";
import { CheckCircle, RotateCcw, Calendar } from "lucide-react";

interface Props {
  results: CalculatorResults;
  inputs: CalculatorInputs;
  onReset: () => void;
}

function BarChart({ items }: { items: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">{item.value} h</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-hero-gradient rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DetailedReport({ results, inputs, onReset }: Props) {
  const insight = getBusinessInsight(results, inputs);
  const recommendations = getRecommendations(results, inputs);
  const maxTime = Math.max(results.timeRecruitments, results.timeAmendments, results.timeDepartures, results.timeInterviews, 1);

  const handleDemo = () => {
    trackEvent("demo_requested");
    window.open("https://www.legipilot.com", "_blank");
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Votre rapport détaillé</h2>
            <p className="text-muted-foreground">Analyse complète de votre gestion RH</p>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-5">Résumé chiffré</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Heures consommées", value: `${results.totalAnnualHours.toLocaleString("fr-FR")} h/an` },
                { label: "Coût annuel", value: `${results.annualCost.toLocaleString("fr-FR")} €/an` },
                { label: "Temps récupérable", value: `${results.recoverableHours.toLocaleString("fr-FR")} h/an` },
                { label: "Économie estimée", value: `${results.potentialSavings.toLocaleString("fr-FR")} €/an` },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-accent/50">
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time breakdown */}
          <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-5">Répartition du temps RH</h3>
            <BarChart
              items={[
                { label: "Embauches / recrutements", value: results.timeRecruitments, max: maxTime },
                { label: "Avenants / modifications", value: results.timeAmendments, max: maxTime },
                { label: "Départs / ruptures", value: results.timeDepartures, max: maxTime },
                { label: "Entretiens / suivi", value: results.timeInterviews, max: maxTime },
              ]}
            />
          </div>

          {/* Business insight */}
          <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-3">Lecture business</h3>
            <p className="text-muted-foreground leading-relaxed">{insight}</p>
          </div>

          {/* Recommendations */}
          <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-5">Recommandations personnalisées</h3>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-accent/50 rounded-xl p-6 md:p-8 text-center border border-border">
            <p className="text-sm text-muted-foreground mb-6">
              Un membre de l'équipe peut vous partager en 15 min les gains concrets observés chez des PME comparables.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-hero-gradient text-primary-foreground hover:opacity-90 gap-2 px-8"
                onClick={handleDemo}
              >
                <Calendar className="w-4 h-4" />
                Demander une démo de LégiPilot
              </Button>
              <Button variant="outline" size="lg" onClick={onReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Recalculer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
