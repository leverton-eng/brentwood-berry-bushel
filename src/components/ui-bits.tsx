import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, CalendarDays, Clock, FlaskConical, MapPin } from "lucide-react";
import type { Farm, FarmEvent, FarmStatus } from "@/data/types";
import { useStore } from "@/lib/store";
import { FARM_IMAGES, STATUS_LABEL, daysSince, formatDate, formatEventDate, isStale } from "@/lib/farm-utils";
import { cn } from "@/lib/utils";

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span title="Demonstration data — not yet verified by the farm" className={cn("inline-flex items-center gap-1 rounded-full border border-sun bg-sun/25 px-2 py-0.5 text-[11px] font-semibold text-sun-foreground", className)}>
      <FlaskConical className="h-3 w-3" aria-hidden /> Sample data
    </span>
  );
}

export function StatusBadge({ status }: { status: FarmStatus }) {
  const cls = status === "open" ? "bg-leaf text-primary-foreground" : status === "closed" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function UpdatedNote({ iso }: { iso: string }) {
  const stale = isStale(iso);
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", stale ? "text-accent font-semibold" : "text-muted-foreground")}>
      <Clock className="h-3 w-3" aria-hidden />
      Updated {formatDate(iso)}{stale && ` · ${daysSince(iso)} days ago — confirm with farm`}
    </span>
  );
}

export function BookmarkButton({ farmId, withLabel }: { farmId: string; withLabel?: boolean }) {
  const { bookmarks, toggleBookmark } = useStore();
  const on = bookmarks.includes(farmId);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggleBookmark(farmId); }}
      aria-pressed={on}
      aria-label={on ? "Remove from saved farms" : "Save farm"}
      className={cn(withLabel ? "btn-outline" : "rounded-full bg-card/90 p-2 text-foreground shadow-card hover:bg-card", on && "text-accent")}
    >
      {on ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {withLabel && (on ? "Saved" : "Save farm")}
    </button>
  );
}

export function FarmCard({ farm }: { farm: Farm }) {
  const { produce } = useStore();
  return (
    <Link to="/farms/$farmId" params={{ farmId: farm.id }} className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={FARM_IMAGES[farm.image]} alt={farm.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3"><StatusBadge status={farm.status} /></div>
        <div className="absolute right-3 top-3"><BookmarkButton farmId={farm.id} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight">{farm.name}</h3>
          {!farm.verified && <SampleBadge />}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{farm.address.split(",").slice(-2).join(",")}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{farm.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {farm.produce.map((fp) => {
            const p = produce.find((x) => x.id === fp.produceId);
            return p ? <span key={p.id} className={cn("chip", fp.availability === "done" && "opacity-50")}>{p.emoji} {p.name}</span> : null;
          })}
        </div>
      </div>
    </Link>
  );
}

export function EventCard({ event }: { event: FarmEvent }) {
  const { farms } = useStore();
  const farm = farms.find((f) => f.id === event.farmId);
  const d = new Date(event.date + "T12:00:00");
  return (
    <article className="card flex gap-4 p-4">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <span className="text-xs font-semibold uppercase">{d.toLocaleDateString("en-US", { month: "short" })}</span>
        <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">{event.title}</h3>
          {!event.verified && <SampleBadge />}
        </div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{formatEventDate(event.date)} · {event.time}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
        </p>
        <p className="text-sm text-muted-foreground">{event.description}</p>
        {farm && (
          <Link to="/farms/$farmId" params={{ farmId: farm.id }} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Hosted by {farm.name} →
          </Link>
        )}
      </div>
    </article>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold md:text-5xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </header>
  );
}
