// Data model for Brentwood U-Pick Connect.
// All records carry `verified`; sample records are `false` until confirmed by the farm.

export type Role = "visitor" | "farmer" | "admin";
export type FarmStatus = "open" | "closed" | "off-season";
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Produce {
  id: string;
  name: string;
  emoji: string;
  months: number[]; // 1-12 approximate availability in Brentwood
  tip: string;
}

export interface FarmProduceEntry {
  produceId: string;
  availability: "available" | "limited" | "coming-soon" | "done";
}

export interface Farm {
  id: string;
  name: string;
  verified: boolean;
  image: "cherries" | "peaches" | "corn";
  tagline: string;
  description: string;
  history: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website?: string;
  hours: Partial<Record<DayKey, string>>; // e.g. "8:00 AM – 5:00 PM"
  status: FarmStatus;
  statusNote?: string;
  produce: FarmProduceEntry[];
  seasonNote: string;
  guidance: string[];
  amenities: string[];
  payment: string[];
  ownerUserId?: string;
  lastUpdated: string; // ISO
}

export interface FarmEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  farmId?: string;
  location: string;
  description: string;
  verified: boolean;
  lastUpdated: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  farmId?: string;
}

export interface VisitPlan {
  id: string;
  date: string;
  farmIds: string[];
  partySize: number;
  notes: string;
}

export interface Flag {
  id: string;
  targetType: "farm" | "event";
  targetId: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}
