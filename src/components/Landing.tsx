import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Building2, Users, Briefcase, Cog } from "lucide-react";

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-sky-soft blur-3xl opacity-50 pointer-events-none" />
        <div className="container relative mx-auto px-4 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-beige-soft text-[hsl(36,40%,30%)] text-xs font-medium mb-6 border border-[hsl(36,30%,80%)]">
              <Sparkles className="w-3.5 h-3.5" />
              Évaluation gratuite · 2 minutes
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-[1.05] mb-6">
              Évaluez la maturité RH de votre entreprise en moins de 2 minutes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Découvrez votre niveau de structuration RH, identifiez les processus les plus chronophages
              et estimez les gains potentiels liés à leur automatisation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={onStart}
                size="lg"
                className="bg-navy hover:bg-navy-deep text-white rounded-full px-7 h-12 text-base font-medium gap-2 group"
              >
                Évaluer mon organisation RH
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-6 h-12 text-base font-medium text-navy hover:bg-secondary"
              >
                <a href="https://www.legipilot.com" target="_blank" rel="noopener noreferrer">
                  Découvrir LégiPilot
                </a>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Confidentiel & RGPD</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Résultats immédiats</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Sans engagement</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-20 lg:py-28 bg-beige-soft/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.18em] text-[hsl(36,40%,40%)] font-semibold mb-3">La plateforme RH</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              La plateforme qui réalise vos opérations RH sur simple demande
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Cog, title: "Structurer", desc: "Formalisez vos processus RH et réduisez les oublis." },
              { icon: ShieldCheck, title: "Sécuriser", desc: "Maîtrisez vos obligations légales et vos échéances RH." },
              { icon: Zap, title: "Automatiser", desc: "Réduisez le temps consacré aux tâches administratives répétitives." },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-2xl p-7 shadow-card border border-border hover:shadow-elevated transition-all hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-soft flex items-center justify-center mb-5">
                  <c.icon className="w-5 h-5 text-sky" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sky font-semibold mb-3">À qui s'adresse cette évaluation</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-5">
                Pensé pour les entreprises de 20 à 300 salariés
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Une évaluation conçue pour les DRH, Responsables RH et dirigeants qui souhaitent
                structurer leur organisation RH et fiabiliser leurs processus.
              </p>
              <Button
                onClick={onStart}
                size="lg"
                className="bg-navy hover:bg-navy-deep text-white rounded-full px-7 h-12 gap-2 group"
              >
                Commencer mon évaluation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Building2, label: "ESN" },
                { icon: Briefcase, label: "Cabinets de conseil" },
                { icon: Cog, label: "Sociétés d'ingénierie" },
                { icon: Users, label: "Entreprises de services" },
              ].map((t) => (
                <div
                  key={t.label}
                  className="bg-white rounded-2xl p-5 border border-border shadow-soft flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-4.5 h-4.5 text-navy" />
                  </div>
                  <span className="text-sm font-medium text-navy">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-navy rounded-3xl p-10 lg:p-14 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.07]" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Prêt à évaluer votre organisation RH ?
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                8 questions, 2 minutes. Recevez votre score de maturité RH et vos pistes d'optimisation.
              </p>
              <Button
                onClick={onStart}
                size="lg"
                className="bg-white text-navy hover:bg-beige rounded-full px-7 h-12 text-base font-medium gap-2 group"
              >
                Commencer mon évaluation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
