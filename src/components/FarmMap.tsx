// Stylized illustrative map of Brentwood. Pins are placed from each farm's lat/lng.
import type { Farm } from "@/data/types";
import { cn } from "@/lib/utils";

const B = { minLat: 37.885, maxLat: 37.955, minLng: -121.765, maxLng: -121.655 };
export function project(lat: number, lng: number) {
  return { x: ((lng - B.minLng) / (B.maxLng - B.minLng)) * 100, y: (1 - (lat - B.minLat) / (B.maxLat - B.minLat)) * 100 };
}

export function FarmMap({ farms, selectedId, onSelect, className }: { farms: Farm[]; selectedId?: string | undefined; onSelect?: (id: string) => void; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-map-land", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M0,20 C25,25 40,10 60,18 S90,30 100,24" className="fill-none stroke-map-water" strokeWidth="2.5" />
        <path d="M50,0 L48,100" className="stroke-map-road" strokeWidth="1.6" />
        <path d="M0,55 L100,50" className="stroke-map-road" strokeWidth="1.6" />
        <path d="M10,100 L80,0" className="stroke-map-road" strokeWidth="0.9" />
        <path d="M0,80 L100,78" className="stroke-map-road" strokeWidth="0.9" />
        <circle cx="52" cy="58" r="7" className="fill-sun/30" />
      </svg>
      <span className="absolute left-[44%] top-[62%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Downtown</span>
      <span className="absolute left-[50%] top-1 text-[10px] text-muted-foreground">Hwy 4 ↑</span>
      <span className="absolute left-2 top-[14%] text-[10px] italic text-muted-foreground">Marsh Creek</span>
      {farms.map((f) => {
        const p = project(f.lat, f.lng);
        const sel = f.id === selectedId;
        return (
          <button
            key={f.id}
            onClick={() => onSelect?.(f.id)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className={cn("group absolute -translate-x-1/2 -translate-y-full focus:outline-none", sel && "z-10")}
            aria-label={`${f.name}, ${f.status}`}
          >
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-full rounded-bl-none -rotate-45 border-2 border-card shadow-card transition-transform group-hover:scale-110",
              f.status === "open" ? "bg-leaf" : f.status === "closed" ? "bg-destructive" : "bg-muted-foreground", sel && "scale-125 ring-4 ring-sun")}>
              <span className="rotate-45 text-sm">🌱</span>
            </span>
            <span className="mt-1 block whitespace-nowrap rounded bg-card/90 px-1.5 text-[10px] font-semibold text-foreground">{f.name}</span>
          </button>
        );
      })}
      <p className="absolute bottom-2 left-2 rounded bg-card/90 px-2 py-1 text-[10px] text-muted-foreground">Illustrative map · not to scale</p>
    </div>
  );
}
