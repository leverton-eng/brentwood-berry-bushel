// Expected visitor levels (FR-V10).
// Combines visits planned in this app with SAMPLE community planned visits.
// Replace sampleCommunityVisits() with real aggregated planned-visit data when a backend exists.
import type { VisitPlan } from "@/data/types";

export type CrowdLevel = "quiet" | "moderate" | "busy";

export const CROWD_LABEL: Record<CrowdLevel, string> = {
  quiet: "Quiet",
  moderate: "Moderate",
  busy: "Busy",
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic sample count of people planning to visit (demo only). */
export function sampleCommunityVisits(farmId: string, date: string) {
  const day = new Date(date + "T12:00:00").getDay();
  const weekend = day === 0 || day === 6;
  const base = weekend ? 45 : 12;
  return base + (hash(farmId + date) % (weekend ? 50 : 20));
}

export function expectedVisitors(farmId: string, date: string, plans: VisitPlan[]) {
  const mine = plans.filter((p) => p.date === date && p.farmIds.includes(farmId)).reduce((n, p) => n + p.partySize, 0);
  const total = sampleCommunityVisits(farmId, date) + mine;
  const level: CrowdLevel = total >= 65 ? "busy" : total >= 30 ? "moderate" : "quiet";
  return { total, mine, level };
}

export function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function nextDays(n: number) {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    out.push(isoDate(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
