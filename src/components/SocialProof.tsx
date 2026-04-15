import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "On a réalisé qu'on passait plus de 300 heures par an sur des tâches RH répétitives. LégiPilot nous a permis d'en récupérer un tiers.",
    author: "Sophie M.",
    role: "DRH",
    company: "PME industrielle, 120 salariés",
  },
  {
    quote: "En tant que dirigeant, je gérais les RH moi-même sans mesurer le temps réel que ça prenait. Le calculateur m'a ouvert les yeux.",
    author: "Thomas L.",
    role: "CEO",
    company: "Société de services, 45 salariés",
  },
  {
    quote: "L'outil a mis des chiffres sur ce qu'on ressentait intuitivement. Ça a convaincu notre direction d'investir dans la structuration RH.",
    author: "Claire D.",
    role: "RRH",
    company: "Groupe retail, 200 salariés",
  },
];

export default function SocialProof() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ils ont mesuré leur coût caché
          </h2>
          <p className="text-muted-foreground">
            Des dirigeants et DRH de PME témoignent.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.author} className="bg-background rounded-xl shadow-card p-6 flex flex-col">
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-sm leading-relaxed flex-1 mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role} — {t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
