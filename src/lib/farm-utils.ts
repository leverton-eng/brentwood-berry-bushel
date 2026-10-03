import type { DayKey, Farm, FarmStatus, Produce } from "@/data/types";
import cherries from "@/assets/farm-cherries.jpg";
import peaches from "@/assets/farm-peaches.jpg";
import corn from "@/assets/farm-corn.jpg";

export const FARM_IMAGES: Record<Farm["image"], string> = { cherries, peaches, corn };
export const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" }, { key: "tue", label: "Tuesday" }, { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" }, { key: "fri", label: "Friday" }, { key: "sat", label: "Saturday" }, { key: "sun", label: "Sunday" },
];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const STATUS_LABEL: Record<FarmStatus, string> = { open: "Open for picking", closed: "Temporarily closed", "off-season": "Off-season" };
export const AVAIL_LABEL = { available: "Picking now", limited: "Limited", "coming-soon": "Coming soon", done: "Season over" } as const;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
export function formatEventDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
export function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}
export function isStale(iso: string, days = 30) { return daysSince(iso) > days; }
export function directionsUrl(f: Farm) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(f.address)}`;
}
export function produceName(list: Produce[], id: string) {
  return list.find((p) => p.id === id);
}
