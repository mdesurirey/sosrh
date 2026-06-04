import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/scoring";

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

interface Props {
  onSubmit: (data: LeadData) => void;
  context?: Record<string, unknown>;
}

export default function LeadForm({ onSubmit, context }: Props) {
  const [data, setData] = useState<LeadData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (k: keyof LeadData, v: string) => {
    setData((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.firstName.trim()) e.firstName = "Requis";
    if (!data.lastName.trim()) e.lastName = "Requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Email professionnel valide requis";
    if (!data.company.trim()) e.company = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    trackEvent("lead_submitted", { ...data, ...context });
    setTimeout(() => {
      setLoading(false);
      onSubmit(data);
    }, 300);
  };

  const field = (k: keyof LeadData, label: string, type = "text", required = true) => (
    <div className="space-y-1.5">
      <Label htmlFor={k} className="text-sm font-medium text-navy">
        {label} {required && <span className="text-sky">*</span>}
      </Label>
      <Input
        id={k}
        type={type}
        value={data[k]}
        onChange={(e) => update(k, e.target.value)}
        className={`h-11 rounded-xl bg-white ${errors[k] ? "border-destructive" : ""}`}
      />
      {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <section className="min-h-screen bg-beige-soft/30 py-16 flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy text-white text-xs font-medium mb-5">
              <Lock className="w-3.5 h-3.5" /> Accès au rapport détaillé
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              Recevez votre rapport détaillé
            </h1>
            <p className="text-muted-foreground text-sm">
              Analyse complète, opportunités d'automatisation et recommandations personnalisées.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-7 lg:p-8 shadow-elevated border border-border space-y-4 animate-scale-in"
          >
            <div className="grid grid-cols-2 gap-3">
              {field("firstName", "Prénom")}
              {field("lastName", "Nom")}
            </div>
            {field("email", "Email professionnel", "email")}
            {field("phone", "Téléphone", "tel", false)}
            {field("company", "Société")}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-navy hover:bg-navy-deep text-white rounded-full font-medium text-base"
            >
              {loading ? "Génération du rapport…" : "Recevoir mon rapport détaillé"}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="w-3 h-3" /> Données protégées · RGPD · Aucun spam
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
