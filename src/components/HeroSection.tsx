import { ArrowDown, Calculator, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartCalculator: () => void;
  onHowItWorks: () => void;
}

export default function HeroSection({ onStartCalculator, onHowItWorks }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container relative mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle" />
            Solution RH hébergée en France
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Combien vous coûte{" "}
            <span className="text-gradient">réellement</span>
            <br />
            une gestion RH manuelle ?
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Estimez en 2 minutes le temps perdu, le coût interne annuel et le potentiel de gain en automatisant vos processus RH.
          </p>

          {/* Reassurance */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" />
              Sans engagement
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" />
              Résultat immédiat
            </span>
            <span className="flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-primary" />
              PME de 20 à 250 salariés
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-hero-gradient text-primary-foreground hover:opacity-90 transition-opacity text-base px-8 py-6 shadow-elevated"
              onClick={onStartCalculator}
            >
              Calculer mon coût caché
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground gap-2"
              onClick={onHowItWorks}
            >
              Voir comment ça fonctionne
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
