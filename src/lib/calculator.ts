export interface CalculatorInputs {
  employees: number;
  sector: string;
  dedicatedHR: "yes" | "no" | "partial";
  recruitmentsPerYear: number;
  amendmentsPerYear: number;
  departuresPerYear: number;
  interviewCampaignsPerYear: number;
  timePerRecruitment: number;
  timePerAmendment: number;
  timePerDeparture: number;
  timePerInterview: number;
  hourlyCost: number;
}

export interface CalculatorResults {
  timeRecruitments: number;
  timeAmendments: number;
  timeDepartures: number;
  timeInterviews: number;
  totalAnnualHours: number;
  annualCost: number;
  gainRate: number;
  recoverableHours: number;
  potentialSavings: number;
  maturityScore: number;
  maturityLevel: string;
}

export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  const timeRecruitments = inputs.recruitmentsPerYear * inputs.timePerRecruitment;
  const timeAmendments = inputs.amendmentsPerYear * inputs.timePerAmendment;
  const timeDepartures = inputs.departuresPerYear * inputs.timePerDeparture;
  const timeInterviews = inputs.interviewCampaignsPerYear * inputs.employees * inputs.timePerInterview;

  const totalAnnualHours = timeRecruitments + timeAmendments + timeDepartures + timeInterviews;
  const annualCost = totalAnnualHours * inputs.hourlyCost;

  // Gain rate
  let gainRate = 0.25;
  if (inputs.employees >= 50 && inputs.employees < 100) gainRate = 0.30;
  else if (inputs.employees >= 100 && inputs.employees <= 250) gainRate = 0.35;
  else if (inputs.employees > 250) gainRate = 0.35;

  if (inputs.dedicatedHR === "no") gainRate += 0.05;
  gainRate = Math.min(gainRate, 0.40);

  const recoverableHours = Math.round(totalAnnualHours * gainRate);
  const potentialSavings = Math.round(annualCost * gainRate);

  // Maturity score
  let score = 50;
  if (inputs.dedicatedHR === "no") score -= 20;
  else if (inputs.dedicatedHR === "partial") score -= 10;

  const volumePerEmployee = (inputs.recruitmentsPerYear + inputs.amendmentsPerYear + inputs.departuresPerYear) / inputs.employees;
  if (volumePerEmployee > 1) score -= 15;
  else if (volumePerEmployee > 0.5) score -= 8;

  const hoursPerEmployee = totalAnnualHours / inputs.employees;
  if (hoursPerEmployee > 10) score -= 15;
  else if (hoursPerEmployee > 5) score -= 8;

  if (annualCost > inputs.employees * 200) score -= 10;

  score = Math.max(10, Math.min(100, score));

  let maturityLevel: string;
  if (score < 35) maturityLevel = "Faible structuration";
  else if (score < 65) maturityLevel = "Structuration intermédiaire";
  else maturityLevel = "RH à optimiser";

  return {
    timeRecruitments: Math.round(timeRecruitments * 10) / 10,
    timeAmendments: Math.round(timeAmendments * 10) / 10,
    timeDepartures: Math.round(timeDepartures * 10) / 10,
    timeInterviews: Math.round(timeInterviews * 10) / 10,
    totalAnnualHours: Math.round(totalAnnualHours),
    annualCost: Math.round(annualCost),
    gainRate,
    recoverableHours,
    potentialSavings,
    maturityScore: score,
    maturityLevel,
  };
}

export function getBusinessInsight(results: CalculatorResults, inputs: CalculatorInputs): string {
  if (results.maturityScore < 35) {
    return "Votre organisation semble encore très dépendante d'actions manuelles sur les événements RH clés. Le volume d'opérations combiné à l'absence de structuration dédiée crée probablement un coût caché significatif.";
  } else if (results.maturityScore < 65) {
    return "Vous avez déjà une base structurée, mais certains flux restent très consommateurs de temps. Des gains rapides sont possibles en automatisant les processus les plus répétitifs.";
  }
  return "Votre structuration RH est en bonne voie. Des optimisations ciblées sur les flux les plus chronophages permettraient d'améliorer encore votre efficacité.";
}

export function getRecommendations(results: CalculatorResults, inputs: CalculatorInputs): string[] {
  const recs: string[] = [];

  if (inputs.dedicatedHR === "no" || inputs.dedicatedHR === "partial") {
    recs.push("Centraliser les dossiers salariés dans un espace unique et sécurisé");
  }
  if (results.timeRecruitments > results.totalAnnualHours * 0.3) {
    recs.push("Automatiser les entrées / sorties avec des workflows pré-configurés");
  }
  if (results.timeAmendments > results.totalAnnualHours * 0.2) {
    recs.push("Standardiser les documents RH avec des modèles juridiquement conformes");
  }
  if (results.timeInterviews > results.totalAnnualHours * 0.25) {
    recs.push("Structurer les campagnes d'entretiens avec un suivi automatisé");
  }
  recs.push("Fiabiliser les échéances RH avec des alertes et rappels automatiques");
  recs.push("Mieux tracer les événements collaborateurs pour un historique complet");

  return recs.slice(0, 3);
}

// Tracking helpers
export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  // HubSpot tracking placeholder
  if (typeof window !== "undefined" && (window as any)._hsq) {
    (window as any)._hsq.push(["trackCustomBehavioralEvent", { name: eventName, properties: data }]);
  }
  // Generic event placeholder
  console.log(`[LégiPilot Track] ${eventName}`, data);
}
