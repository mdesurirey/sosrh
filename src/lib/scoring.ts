export interface Answers {
  headcount: "20-49" | "50-99" | "100-199" | "200-300" | "";
  recruitments: number;
  amendments: number;
  departures: number;
  processManagement: 0 | 1 | 2 | 3 | -1;
  complianceManagement: 0 | 1 | 2 | 3 | -1;
  avgSalary: number;
  mainChallenge: string;
}

export interface ScoreResult {
  total: number; // /100
  label: string;
  subscores: {
    processes: number; // /100
    compliance: number;
    automation: number;
    organization: number;
  };
  estimatedHours: number;
  recoverableHours: number;
  hourlyCost: number;
  annualCost: number;
  potentialSavings: number;
  headcountMid: number;
}

const HEADCOUNT_MID: Record<string, number> = {
  "20-49": 35,
  "50-99": 75,
  "100-199": 150,
  "200-300": 250,
};

// Per-event time estimates (hours)
const TIME_RECRUITMENT = 8;
const TIME_AMENDMENT = 1.5;
const TIME_DEPARTURE = 4;

export function calculate(a: Answers): ScoreResult {
  const headcountMid = HEADCOUNT_MID[a.headcount] || 50;

  // Hourly cost = salary brut * 1.45 (charges) / 1607h
  const hourlyCost = a.avgSalary > 0 ? Math.round((a.avgSalary * 1.45) / 1607) : 35;

  const estimatedHours = Math.round(
    a.recruitments * TIME_RECRUITMENT +
      a.amendments * TIME_AMENDMENT +
      a.departures * TIME_DEPARTURE,
  );
  const annualCost = Math.round(estimatedHours * hourlyCost);

  // Subscores
  // Processes (35%): based on processManagement (0-3)
  const procMap = [25, 50, 70, 90];
  const processes = a.processManagement >= 0 ? procMap[a.processManagement] : 50;

  // Compliance (25%)
  const compMap = [20, 45, 70, 92];
  const compliance = a.complianceManagement >= 0 ? compMap[a.complianceManagement] : 50;

  // Automation (25%) — average of process + compliance, weighted lower bands
  const autoMap = [15, 40, 70, 95];
  const autoP = a.processManagement >= 0 ? autoMap[a.processManagement] : 40;
  const autoC = a.complianceManagement >= 0 ? autoMap[a.complianceManagement] : 40;
  const automation = Math.round((autoP + autoC) / 2);

  // Organization (15%) — volumetry vs headcount
  const eventsPerEmployee = (a.recruitments + a.amendments + a.departures) / Math.max(headcountMid, 1);
  let organization = 75;
  if (eventsPerEmployee > 1.2) organization = 35;
  else if (eventsPerEmployee > 0.7) organization = 55;
  else if (eventsPerEmployee > 0.4) organization = 70;
  else organization = 85;

  const total = Math.round(
    processes * 0.35 + compliance * 0.25 + automation * 0.25 + organization * 0.15,
  );

  // Recovery rate — inverse to automation maturity
  const recoveryRate = Math.max(0.15, Math.min(0.55, (100 - automation) / 180 + 0.15));
  const recoverableHours = Math.round(estimatedHours * recoveryRate);
  const potentialSavings = Math.round(annualCost * recoveryRate);

  return {
    total,
    label: labelForScore(total),
    subscores: { processes, compliance, automation, organization },
    estimatedHours,
    recoverableHours,
    hourlyCost,
    annualCost,
    potentialSavings,
    headcountMid,
  };
}

export function labelForScore(score: number): string {
  if (score < 35) return "Organisation RH peu structurée";
  if (score < 55) return "Organisation RH en cours de structuration";
  if (score < 75) return "Organisation RH structurée";
  return "Organisation RH mature et automatisée";
}

export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // GA4 / Google Ads
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, data || {});
  }
  // HubSpot
  if (w._hsq && Array.isArray(w._hsq)) {
    w._hsq.push(["trackCustomBehavioralEvent", { name, properties: data }]);
  }
  // dataLayer (GTM)
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...(data || {}) });
  }
};
