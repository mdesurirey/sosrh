import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trackEvent } from "@/lib/calculator";
import { FileText, Lock } from "lucide-react";

const functions = ["DRH", "RRH", "Office Manager", "Directeur administratif", "Dirigeant / CEO", "DAF", "Autre"];
const challenges = [
  "Gagner du temps administratif",
  "Sécuriser mes procédures RH",
  "Centraliser mes dossiers salariés",
  "Structurer la gestion des entretiens",
  "Mieux gérer les entrées / sorties",
  "Réduire les erreurs et oublis",
  "Autre",
];
const companySizes = ["1-19", "20-49", "50-99", "100-249", "250+"];

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  companySize: string;
  mainChallenge: string;
  consent: boolean;
}

interface Props {
  onSubmit: (data: LeadData) => void;
  calculatorData?: Record<string, unknown>;
}

export default function LeadForm({ onSubmit, calculatorData }: Props) {
  const [data, setData] = useState<LeadData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    companySize: "",
    mainChallenge: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof LeadData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.firstName.trim()) e.firstName = "Requis";
    if (!data.lastName.trim()) e.lastName = "Requis";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Email professionnel valide requis";
    if (!data.company.trim()) e.company = "Requis";
    if (!data.role) e.role = "Requis";
    if (!data.consent) e.consent = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    trackEvent("lead_form_submitted", { ...data, ...calculatorData } as Record<string, unknown>);
    onSubmit(data);
  };

  const field = (key: keyof LeadData, label: string, placeholder: string, type = "text") => (
    <div className="space-y-1.5" key={key}>
      <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
      <Input
        id={key}
        type={type}
        placeholder={placeholder}
        value={data[key] as string}
        onChange={(e) => update(key, e.target.value)}
        className={`bg-background ${errors[key] ? "border-destructive" : ""}`}
      />
      {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/* Gating header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              Rapport détaillé
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Recevez votre rapport détaillé et vos pistes d'optimisation
            </h2>
            <p className="text-sm text-muted-foreground">
              Renseignez vos coordonnées pour accéder à l'analyse complète.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-background rounded-xl shadow-elevated p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {field("firstName", "Prénom", "Jean")}
              {field("lastName", "Nom", "Dupont")}
            </div>
            {field("email", "Email professionnel", "jean@entreprise.fr", "email")}
            {field("phone", "Téléphone", "06 12 34 56 78", "tel")}
            {field("company", "Société", "Mon Entreprise SAS")}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Fonction</Label>
                <Select value={data.role} onValueChange={(v) => update("role", v)}>
                  <SelectTrigger className={`bg-background ${errors.role ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {functions.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Taille de l'entreprise</Label>
                <Select value={data.companySize} onValueChange={(v) => update("companySize", v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((s) => (
                      <SelectItem key={s} value={s}>{s} salariés</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Principal enjeu RH</Label>
              <Select value={data.mainChallenge} onValueChange={(v) => update("mainChallenge", v)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Sélectionnez votre enjeu principal" />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="consent"
                checked={data.consent}
                onCheckedChange={(v) => update("consent", !!v)}
              />
              <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                J'accepte d'être recontacté par l'équipe LégiPilot
              </Label>
            </div>
            {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

            <Button
              type="submit"
              className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90 py-6 text-base"
            >
              Accéder à mon rapport détaillé
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Vos données sont protégées conformément au RGPD et ne seront jamais partagées.
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
