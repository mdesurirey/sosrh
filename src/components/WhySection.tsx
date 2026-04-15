import { Clock, EyeOff, Cog } from "lucide-react";

const items = [
  {
    icon: Clock,
    title: "Temps RH gaspillé",
    description:
      "Les tâches administratives répétitives — embauches, avenants, départs — mobilisent un volume d'heures considérable chaque année, souvent invisible.",
  },
  {
    icon: EyeOff,
    title: "Coûts invisibles",
    description:
      "Sans mesure précise, le coût réel de la gestion RH manuelle reste un angle mort. Salaire chargé, temps management, corrections d'erreurs : la facture s'accumule.",
  },
  {
    icon: Cog,
    title: "Process trop manuels",
    description:
      "Tableurs, emails, documents éparpillés… Une gestion non structurée augmente les risques d'erreurs, d'oublis et de non-conformité.",
  },
];

export default function WhySection() {
  return (
    <section id="how-it-works" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Pourquoi cet outil ?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Identifiez en quelques clics les leviers de performance RH les plus impactants pour votre PME.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-background shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
