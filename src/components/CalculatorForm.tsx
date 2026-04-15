import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CalculatorInputs } from "@/lib/calculator";
import { trackEvent } from "@/lib/calculator";
import { ChevronRight, ChevronLeft, Calculator } from "lucide-react";

const sectors = [
  "Services",
  "Industrie",
  "BTP",
  "Retail / commerce",
  "Santé / médico-social",
  "Hôtellerie / restauration",
  "Autre",
];

interface Props {
  onSubmit: (inputs: CalculatorInputs) => void;
}

export default function CalculatorForm({ onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<CalculatorInputs>({
    employees: 0,
    sector: "",
    dedicatedHR: "no",
    recruitmentsPerYear: 0,
    amendmentsPerYear: 0,
    departuresPerYear: 0,
    interviewCampaignsPerYear: 0,
    timePerRecruitment: 0,
    timePerAmendment: 0,
    timePerDeparture: 0,
    timePerInterview: 0,
    hourlyCost: 0,
  });

  const update = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const numField = (field: keyof CalculatorInputs, label: string, placeholder: string, step?: number, helpText?: string) => (
    <div className="space-y-2" key={field}>
      <Label htmlFor={field} className="text-sm font-medium">{label}</Label>
      <Input
        id={field}
        type="number"
        min={0}
        step={step || 1}
        placeholder={placeholder}
        value={inputs[field] || ""}
        onChange={(e) => update(field, parseFloat(e.target.value) || 0)}
        className={`bg-background ${errors[field] ? "border-destructive" : ""}`}
      />
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      {errors[field] && <p className="text-xs text-destructive">{errors[field]}</p>}
    </div>
  );

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!inputs.employees || inputs.employees < 1) newErrors.employees = "Requis";
      if (!inputs.sector) newErrors.sector = "Requis";
    }
    if (step === 1) {
      if (!inputs.recruitmentsPerYear && inputs.recruitmentsPerYear !== 0) newErrors.recruitmentsPerYear = "Requis";
    }
    if (step === 3) {
      if (!inputs.hourlyCost || inputs.hourlyCost < 1) newErrors.hourlyCost = "Requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 0) trackEvent("calculator_started", { employees: inputs.employees });
    setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!validateStep()) return;
    trackEvent("calculator_results_requested", inputs as unknown as Record<string, unknown>);
    onSubmit(inputs);
  };

  const steps = ["Entreprise", "Volumétrie RH", "Temps passé", "Coût interne"];

  return (
    <section id="calculator" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Calculez votre coût caché
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Renseignez quelques données pour obtenir une estimation personnalisée.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-10 px-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl shadow-elevated p-6 md:p-8">
            {/* Step 0: Contexte */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-4">Contexte entreprise</h3>
                {numField("employees", "Nombre de salariés", "ex. 45")}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Secteur d'activité</Label>
                  <Select value={inputs.sector} onValueChange={(v) => update("sector", v)}>
                    <SelectTrigger className={`bg-background ${errors.sector ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Sélectionnez votre secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sector && <p className="text-xs text-destructive">{errors.sector}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Avez-vous une personne dédiée aux RH ?</Label>
                  <RadioGroup
                    value={inputs.dedicatedHR}
                    onValueChange={(v) => update("dedicatedHR", v)}
                    className="flex gap-6"
                  >
                    {[
                      { value: "yes", label: "Oui" },
                      { value: "no", label: "Non" },
                      { value: "partial", label: "Partiellement" },
                    ].map((o) => (
                      <div key={o.value} className="flex items-center gap-2">
                        <RadioGroupItem value={o.value} id={`hr-${o.value}`} />
                        <Label htmlFor={`hr-${o.value}`} className="text-sm cursor-pointer">{o.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 1: Volumétrie */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-4">Volumétrie RH annuelle</h3>
                {numField("recruitmentsPerYear", "Nombre de recrutements par an", "ex. 12")}
                {numField("amendmentsPerYear", "Nombre d'avenants / modifications contractuelles par an", "ex. 18")}
                {numField("departuresPerYear", "Nombre de départs / ruptures par an", "ex. 6")}
                {numField("interviewCampaignsPerYear", "Nombre de campagnes d'entretiens par an", "ex. 2")}
              </div>
            )}

            {/* Step 2: Temps passé */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-4">Temps passé</h3>
                {numField("timePerRecruitment", "Temps moyen par recrutement / embauche (heures)", "ex. 4", 0.5)}
                {numField("timePerAmendment", "Temps moyen par avenant / modification (heures)", "ex. 1.5", 0.5)}
                {numField("timePerDeparture", "Temps moyen par départ / rupture (heures)", "ex. 5", 0.5)}
                {numField("timePerInterview", "Temps moyen par entretien / suivi administratif (heures)", "ex. 1", 0.5)}
              </div>
            )}

            {/* Step 3: Coût interne */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-4">Coût interne</h3>
                {numField(
                  "hourlyCost",
                  "Coût horaire moyen estimé des personnes gérant ces sujets RH (€)",
                  "ex. 35",
                  1,
                  "Incluez salaire chargé + coût du temps management impliqué."
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 0 ? (
                <Button variant="outline" onClick={prev} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </Button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Button onClick={next} className="bg-hero-gradient text-primary-foreground hover:opacity-90 gap-2">
                  Suivant <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-hero-gradient text-primary-foreground hover:opacity-90 gap-2">
                  <Calculator className="w-4 h-4" /> Voir mes résultats
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
