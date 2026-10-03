import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { z } from "zod";
import { FarmMap } from "@/components/FarmMap";
import { PageHeader, SampleBadge, StatusBadge, UpdatedNote } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { directionsUrl } from "@/lib/farm-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  validateSearch: z.object({ farm: z.string().optional().catch(undefined) }),
  head: () => ({
    meta: [
      { title: "Farm Map — Brentwood U-Pick Connect" },
      { name: "description", content: "See participating Brentwood U-pick farms on a map and get directions." },
      { property: "og:title", content: "Brentwood U-Pick Farm Map" },
      { property: "og:description", content: "Find U-pick farms around Brentwood, CA on an interactive map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { farms, produce } = useStore();
  const { farm: sel } = Route.useSearch();
  const nav = Route.useNavigate();
  const selected = farms.find((f) => f.id === sel);
  const choose = (id: string) => nav({ search: { farm: id }, replace: true });

  return (
    <>
      <PageHeader eyebrow="Map" title="Farms around Brentwood">Tap a pin to see quick details. Green = open, red = temporarily closed, gray = off-season.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FarmMap farms={farms} selectedId={sel} onSelect={choose} className="aspect-[4/3] w-full" />
        </div>
        <div className="space-y-4">
          {selected ? (
            <div className="card space-y-3 p-5">
              <div className="flex flex-wrap gap-2"><StatusBadge status={selected.status} />{!selected.verified && <SampleBadge />}</div>
              <h2 className="text-2xl font-semibold">{selected.name}</h2>
              <p className="flex gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{selected.address}</p>
              <p className="text-sm">{selected.produce.map((fp) => produce.find((p) => p.id === fp.produceId)?.emoji + " " + produce.find((p) => p.id === fp.produceId)?.name).join(" · ")}</p>
              <UpdatedNote iso={selected.lastUpdated} />
              <div className="flex flex-wrap gap-2 pt-1">
                <Link to="/farms/$farmId" params={{ farmId: selected.id }} className="btn-primary">View farm profile</Link>
                <a href={directionsUrl(selected)} target="_blank" rel="noreferrer" className="btn-outline"><Navigation className="h-4 w-4" />Directions</a>
              </div>
            </div>
          ) : (
            <p className="card p-5 text-sm text-muted-foreground">Select a farm on the map or from the list below.</p>
          )}
          <ul className="card divide-y divide-border">
            {farms.map((f) => (
              <li key={f.id}>
                <button onClick={() => choose(f.id)} className={cn("flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm hover:bg-secondary", f.id === sel && "bg-secondary font-semibold")}>
                  {f.name}<span className={cn("h-2.5 w-2.5 rounded-full", f.status === "open" ? "bg-leaf" : f.status === "closed" ? "bg-destructive" : "bg-muted-foreground")} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
