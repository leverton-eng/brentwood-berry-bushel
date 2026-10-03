import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarPlus, Clock, ExternalLink, Info, Mail, MapPin, Navigation, Phone, Sprout } from "lucide-react";
import { useEffect } from "react";
import { FARMS } from "@/data/sample-data";
import { BookmarkButton, EventCard, SampleBadge, StatusBadge, UpdatedNote } from "@/components/ui-bits";
import { CrowdBadge } from "@/components/CrowdBadge";
import { ShareButton } from "@/components/ShareButton";
import { useStore } from "@/lib/store";
import { expectedVisitors, nextDays } from "@/lib/crowd";
import { AVAIL_LABEL, DAYS, FARM_IMAGES, MONTHS, directionsUrl, formatEventDate } from "@/lib/farm-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/farms/$farmId")({
  loader: ({ params }) => {
    const farm = FARMS.find((f) => f.id === params.farmId);
    if (!farm) throw notFound();
    return { name: farm.name, tagline: farm.tagline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Farm not found" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.name} — Brentwood U-Pick Connect` },
        { name: "description", content: `${loaderData.tagline}. Hours, produce, harvest info and directions.` },
        { property: "og:title", content: loaderData.name },
        { property: "og:description", content: loaderData.tagline },
      ],
    };
  },
  notFoundComponent: FarmNotFound,
  component: FarmProfile,
});

function FarmNotFound() {
  return <div className="mx-auto max-w-md px-4 py-20 text-center"><h1 className="text-3xl">Farm not found</h1><Link to="/farms" className="btn-primary mt-6">Back to farms</Link></div>;
}

function FarmProfile() {
  const { farmId } = Route.useParams();
  const { farms, produce, events, plans, track } = useStore();
  const farm = farms.find((f) => f.id === farmId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { track("pageViews", farmId); }, [farmId]);
  if (!farm) return <FarmNotFound />;
  const farmEvents = events.filter((e) => e.farmId === farm.id).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <article>
      <div className="relative h-64 md:h-96">
        <img src={FARM_IMAGES[farm.image]} alt={farm.name} width={1024} height={768} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-x-0 top-0 mx-auto max-w-6xl px-4 pt-4">
          <Link to="/farms" className="inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-sm font-semibold text-foreground shadow-card hover:bg-background">← All farms</Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2"><StatusBadge status={farm.status} />{!farm.verified && <SampleBadge />}</div>
          <h1 className="mt-2 text-3xl font-semibold text-primary-foreground md:text-5xl">{farm.name}</h1>
          <p className="text-primary-foreground/90">{farm.tagline}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {farm.statusNote && (
            <div className="card flex gap-3 border-sun bg-sun/15 p-4">
              <Info className="h-5 w-5 shrink-0 text-accent" />
              <div><p className="font-semibold">{farm.statusNote}</p><UpdatedNote iso={farm.lastUpdated} /></div>
            </div>
          )}
          <section className="card p-5">
            <h2 className="text-xl font-semibold">About the farm</h2>
            <p className="mt-2 text-muted-foreground">{farm.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">{farm.history}</p>
          </section>

          <section className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">Produce & harvest</h2><UpdatedNote iso={farm.lastUpdated} /></div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {farm.produce.map((fp) => {
                const p = produce.find((x) => x.id === fp.produceId);
                if (!p) return null;
                return (
                  <li key={p.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{p.emoji} {p.name}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", fp.availability === "available" ? "bg-leaf text-primary-foreground" : fp.availability === "limited" ? "bg-sun text-sun-foreground" : "bg-muted text-muted-foreground")}>{AVAIL_LABEL[fp.availability]}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Typical: {p.months.map((m) => MONTHS[m - 1]).join(", ")} · {p.tip}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground"><Sprout className="mr-1 inline h-4 w-4 text-primary" />{farm.seasonNote}</p>
          </section>

          <section className="card p-5">
            <h2 className="text-xl font-semibold">Before you visit</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">{farm.guidance.map((g) => <li key={g}>{g}</li>)}</ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {farm.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
              {farm.payment.map((p) => <span key={p} className="chip bg-primary/10 text-primary">💳 {p}</span>)}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Upcoming farm events</h2>
            {farmEvents.length ? <div className="grid gap-3">{farmEvents.map((e) => <EventCard key={e.id} event={e} />)}</div> : <p className="card p-4 text-sm text-muted-foreground">No events listed for this farm.</p>}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card space-y-3 p-5">
            <Link to="/plan" search={{ farm: farm.id }} className="btn-primary w-full"><CalendarPlus className="h-4 w-4" /> Plan a visit</Link>
            <BookmarkButton farmId={farm.id} withLabel />
            <ShareButton
              label="Share this farm"
              title={farm.name}
              text={`Check out ${farm.name} (sample listing) on Brentwood U-Pick Connect — ${farm.address}. Produce: ${farm.produce.filter((p) => p.availability !== "ended").map((p) => p.produceId.replace(/-/g, " ")).join(", ") || "see listing"}.`}
            />
            <a href={directionsUrl(farm)} target="_blank" rel="noreferrer" className="btn-outline w-full"><Navigation className="h-4 w-4" /> Get directions</a>
            <Link to="/map" search={{ farm: farm.id }} className="btn-outline w-full"><MapPin className="h-4 w-4" /> View on farm map</Link>
          </div>
          <div className="card p-5 text-sm">
            <h2 className="text-lg font-semibold">Expected visitors</h2>
            <p className="mt-1 text-xs text-muted-foreground">Estimated from planned visits. Includes sample data.</p>
            <ul className="mt-3 space-y-1.5">
              {nextDays(7).map((d) => {
                const c = expectedVisitors(farm.id, d, plans);
                return (
                  <li key={d} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">{formatEventDate(d)}</span>
                    <CrowdBadge level={c.level} total={c.total} />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card space-y-3 p-5 text-sm">
            <h2 className="text-lg font-semibold">Location & contact</h2>
            <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" />{farm.address}</p>
            <a href={`tel:${farm.phone}`} className="flex gap-2 hover:underline"><Phone className="h-4 w-4 text-primary" />{farm.phone}</a>
            <a href={`mailto:${farm.email}`} className="flex gap-2 break-all hover:underline"><Mail className="h-4 w-4 text-primary" />{farm.email}</a>
            {farm.website && <a href={farm.website} className="flex gap-2 hover:underline"><ExternalLink className="h-4 w-4" />Website</a>}
          </div>
          <div className="card p-5 text-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Clock className="h-4 w-4" /> Hours</h2>
            <dl className="mt-3 space-y-1">
              {DAYS.map((d) => (
                <div key={d.key} className="flex justify-between gap-2"><dt className="text-muted-foreground">{d.label}</dt><dd className="font-medium">{farm.hours[d.key] ?? "Closed"}</dd></div>
              ))}
            </dl>
            <div className="mt-3"><UpdatedNote iso={farm.lastUpdated} /></div>
          </div>
        </aside>
      </div>
      <div className="h-16 lg:hidden" aria-hidden />
      <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-background/95 p-2 backdrop-blur lg:hidden">
        <a href={`tel:${farm.phone}`} className="btn-outline w-full px-2 text-sm"><Phone className="h-4 w-4" /> Call</a>
        <a href={directionsUrl(farm)} target="_blank" rel="noreferrer" className="btn-outline w-full px-2 text-sm"><Navigation className="h-4 w-4" /> Directions</a>
        <Link to="/plan" search={{ farm: farm.id }} className="btn-primary w-full px-2 text-sm"><CalendarPlus className="h-4 w-4" /> Plan</Link>
      </nav>
    </article>
  );
}
