import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Map, Search, Sprout } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { EventCard, FarmCard } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { MONTHS } from "@/lib/farm-utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brentwood U-Pick Connect — Find farms & plan your picking day" },
      { name: "description", content: "Discover U-pick farms in Brentwood, CA: what's in season, farm hours, events and visit planning in one place." },
      { property: "og:title", content: "Brentwood U-Pick Connect" },
      { property: "og:description", content: "Find U-pick farms, harvest seasons and events in Brentwood, California." },
    ],
  }),
  component: Home,
});

function Home() {
  const { farms, produce, events, track } = useStore();
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const month = new Date().getMonth() + 1;
  const inSeason = produce.filter((p) => p.months.includes(month));
  const upcoming = [...events].filter((e) => e.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const featured = [...farms].sort((a, b) => (a.status === "open" ? -1 : 1) - (b.status === "open" ? -1 : 1)).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Sunset over a Brentwood orchard and sunflower field" width={1600} height={912} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:pb-28 md:pt-36">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-sun px-3 py-1 text-xs font-bold uppercase tracking-widest text-sun-foreground"><Sprout className="h-3.5 w-3.5" /> Brentwood, California</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] text-primary-foreground md:text-6xl">Pick your own, straight from the orchard.</h1>
          <p className="mt-4 max-w-xl text-lg text-primary-foreground/90">Find participating U-pick farms, see what's in season, and plan a sunny day in Brentwood's farm country.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); track("searches"); nav({ to: "/farms", search: { q } }); }}
            className="mt-8 flex max-w-xl gap-2 rounded-full bg-card p-1.5 shadow-card"
            role="search"
          >
            <Search className="ml-3 h-5 w-5 self-center text-muted-foreground" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-foreground placeholder:text-muted-foreground focus:outline-none" placeholder="Try “cherries” or a farm name" aria-label="Search farms or produce" />
            <button className="btn-accent px-5">Search</button>
          </form>
        </div>
      </section>

      <section className="mx-auto mt-6 grid max-w-6xl grid-cols-2 gap-3 px-4 md:mt-8 md:grid-cols-4">
        {[
          { to: "/farms", icon: Sprout, label: "Browse farms" },
          { to: "/calendar", icon: CalendarDays, label: "Harvest calendar" },
          { to: "/map", icon: Map, label: "Farm map" },
          { to: "/plan", icon: ClipboardList, label: "Plan a visit" },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="card flex items-center gap-3 p-4 font-semibold hover:bg-secondary">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
            {label}
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">In season · {MONTHS[month - 1]}</p>
            <h2 className="section-title">What's typically ripe now</h2>
          </div>
          <Link to="/calendar" className="text-sm font-semibold text-primary hover:underline">Full calendar →</Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {(inSeason.length ? inSeason : produce.slice(0, 4)).map((p) => (
            <Link key={p.id} to="/farms" search={{ produce: p.id }} className="card flex min-w-[150px] flex-col items-center gap-1 p-4 text-center hover:bg-secondary">
              <span className="text-4xl" aria-hidden>{p.emoji}</span>
              <span className="font-semibold">{p.name}</span>
              <span className="text-xs text-muted-foreground">{p.months.map((m) => MONTHS[m - 1]).join("–")}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="flex items-end justify-between">
          <h2 className="section-title">Featured farms</h2>
          <Link to="/farms" className="text-sm font-semibold text-primary hover:underline">All farms →</Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((f) => <FarmCard key={f.id} farm={f} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="flex items-end justify-between">
          <h2 className="section-title">Upcoming events</h2>
          <Link to="/events" className="text-sm font-semibold text-primary hover:underline">All events →</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>
    </>
  );
}
