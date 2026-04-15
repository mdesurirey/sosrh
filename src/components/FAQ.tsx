import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "À qui s'adresse ce calculateur ?",
    a: "Aux DRH, RRH et dirigeants de PME françaises de 20 à 250 salariés qui souhaitent objectiver le temps et le coût réels de leur gestion RH administrative.",
  },
  {
    q: "Comment est calculé le coût caché ?",
    a: "Le calculateur croise la volumétrie de vos opérations RH (recrutements, avenants, départs, entretiens), le temps passé sur chacune et le coût horaire estimé. Il applique ensuite un taux d'optimisation prudent selon la taille de l'entreprise et la structuration RH existante.",
  },
  {
    q: "Le résultat est-il précis ?",
    a: "Il s'agit d'un ordre de grandeur réaliste, pas d'un audit. L'objectif est de vous donner une vision concrète du potentiel de gain, pour nourrir votre réflexion.",
  },
  {
    q: "Que se passe-t-il après ma demande ?",
    a: "Un membre de l'équipe LégiPilot vous contacte sous 24h pour échanger sur votre contexte et vous montrer les gains concrets observés chez des PME comparables. Sans engagement.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Questions fréquentes
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl shadow-card px-6 border-none">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
