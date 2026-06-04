import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Answers } from "@/lib/scoring";

interface Props {
  onComplete: (answers: Answers) => void;
  onExit: () => void;
}

type Question =
  | { id: keyof Answers; type: "choice"; title: string; subtitle?: string; options: { label: string; value: any; hint?: string }[] }
  | { id: keyof Answers; type: "number"; title: string; subtitle?: string; placeholder: string; suffix?: string; helper?: string };

const QUESTIONS: Question[] = [
  {
    id: "headcount",
    type: "choice",
    title: "Combien de salariés compte votre entreprise ?",
    subtitle: "Une réponse approximative suffit.",
    options: [
      { label: "20 à 49 salariés", value: "20-49" },
      { label: "50 à 99 salariés", value: "50-99" },
      { label: "100 à 199 salariés", value: "100-199" },
      { label: "200 à 300 salariés", value: "200-300" },
    ],
  },
  {
    id: "recruitments",
    type: "number",
    title: "Combien de recrutements réalisez-vous chaque année ?",
    placeholder: "Exemple : 15",
    suffix: "recrutements / an",
  },
  {
    id: "amendments",
    type: "number",
    title: "Combien de modifications contractuelles réalisez-vous chaque année ?",
    subtitle: "Avenants, changements de rémunération, télétravail, mobilité, forfait jours…",
    placeholder: "Exemple : 25",
    suffix: "modifications / an",
  },
  {
    id: "departures",
    type: "number",
    title: "Combien de départs gérez-vous chaque année ?",
    subtitle: "Démissions, ruptures conventionnelles, licenciements.",
    placeholder: "Exemple : 8",
    suffix: "départs / an",
  },
  {
    id: "processManagement",
    type: "choice",
    title: "Comment gérez-vous aujourd'hui vos procédures RH ?",
    options: [
      { label: "Principalement par email", value: 0 },
      { label: "Documents Word et Excel", value: 1 },
      { label: "Plusieurs outils non connectés", value: 2 },
      { label: "Outils RH intégrés et automatisés", value: 3 },
    ],
  },
  {
    id: "complianceManagement",
    type: "choice",
    title: "Comment gérez-vous vos obligations RH et légales ?",
    options: [
      { label: "Suivi manuel", value: 0 },
      { label: "Tableurs et rappels", value: 1 },
      { label: "Outils spécialisés", value: 2 },
      { label: "Processus automatisés", value: 3 },
    ],
  },
  {
    id: "avgSalary",
    type: "number",
    title: "Quel est le salaire brut annuel moyen des personnes qui réalisent les opérations RH ?",
    subtitle: "Nous estimons le coût horaire chargé pour calculer vos gains potentiels.",
    placeholder: "Exemple : 45 000",
    suffix: "€ bruts / an",
  },
  {
    id: "mainChallenge",
    type: "choice",
    title: "Quel est aujourd'hui votre principal enjeu RH ?",
    options: [
      { label: "Gagner du temps", value: "Gagner du temps" },
      { label: "Réduire les risques juridiques", value: "Réduire les risques juridiques" },
      { label: "Structurer notre croissance", value: "Structurer notre croissance" },
      { label: "Harmoniser nos pratiques RH", value: "Harmoniser nos pratiques RH" },
    ],
  },
];

const DEFAULT_ANSWERS: Answers = {
  headcount: "",
  recruitments: 0,
  amendments: 0,
  departures: 0,
  processManagement: -1,
  complianceManagement: -1,
  avgSalary: 0,
  mainChallenge: "",
};

export default function Questionnaire({ onComplete, onExit }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [inputValue, setInputValue] = useState<string>("");

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const currentValue = answers[q.id];
  const isAnswered =
    q.type === "choice"
      ? currentValue !== "" && currentValue !== -1
      : (currentValue as number) > 0;

  const next = () => {
    if (step === QUESTIONS.length - 1) {
      onComplete(answers);
    } else {
      setStep(step + 1);
      setInputValue("");
    }
  };

  const back = () => {
    if (step === 0) {
      onExit();
    } else {
      setStep(step - 1);
      setInputValue("");
    }
  };

  const selectChoice = (value: any) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    setTimeout(() => {
      if (step === QUESTIONS.length - 1) {
        onComplete({ ...answers, [q.id]: value });
      } else {
        setStep(step + 1);
        setInputValue("");
      }
    }, 220);
  };

  const handleNumberSubmit = () => {
    const cleaned = inputValue.replace(/[^\d]/g, "");
    const n = parseInt(cleaned, 10) || 0;
    if (n <= 0) return;
    setAnswers((prev) => ({ ...prev, [q.id]: n }));
    next();
  };

  return (
    <div className="min-h-screen bg-beige-soft/30 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-6">
          <div className="text-sm font-medium text-navy">
            Question <span className="text-sky">{step + 1}</span>
            <span className="text-muted-foreground"> / {QUESTIONS.length}</span>
          </div>
          <div className="flex-1 max-w-md h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-navy rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Quitter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div key={step} className="w-full max-w-2xl animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-3 leading-tight">
            {q.title}
          </h2>
          {q.subtitle && (
            <p className="text-muted-foreground mb-8 md:mb-10 leading-relaxed">{q.subtitle}</p>
          )}
          {!q.subtitle && <div className="mb-8 md:mb-10" />}

          {q.type === "choice" ? (
            <div className="grid gap-3">
              {q.options.map((opt) => {
                const selected = currentValue === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    onClick={() => selectChoice(opt.value)}
                    className={`group text-left p-5 rounded-2xl border-2 transition-all bg-white hover:border-sky hover:shadow-card ${
                      selected ? "border-navy shadow-card bg-sky-soft/40" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-navy">{opt.label}</span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                          selected ? "border-navy bg-navy" : "border-border group-hover:border-sky"
                        }`}
                      >
                        {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
              <div className="flex items-baseline gap-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  placeholder={q.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/[^\d\s]/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleNumberSubmit()}
                  className="text-2xl md:text-3xl font-semibold text-navy border-0 px-0 h-auto py-2 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
                />
                {q.suffix && (
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{q.suffix}</span>
                )}
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between mt-10">
            <Button variant="ghost" onClick={back} className="text-muted-foreground hover:text-navy gap-2 rounded-full">
              <ArrowLeft className="w-4 h-4" />
              {step === 0 ? "Retour" : "Précédent"}
            </Button>
            {q.type === "number" && (
              <Button
                onClick={handleNumberSubmit}
                disabled={!inputValue || parseInt(inputValue.replace(/\s/g, ""), 10) <= 0}
                className="bg-navy hover:bg-navy-deep text-white rounded-full px-6 gap-2 disabled:opacity-40"
              >
                {step === QUESTIONS.length - 1 ? "Voir mes résultats" : "Continuer"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
