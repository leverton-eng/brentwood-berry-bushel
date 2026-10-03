import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EventCard, PageHeader } from "@/components/ui-bits";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Farm & Community Events — Brentwood U-Pick Connect" },
      { name: "description", content: "Upcoming farm and community events around Brentwood, California." },
      { property: "og:title", content: "Brentwood Farm Events" },
      { property: "og:description", content: "Pumpkin patches, harvest markets and farm workshops in Brentwood." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { events, farms } = useStore();
  const [farmId, setFarmId] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const list = events.filter((e) => e.date >= today && (!farmId || (farmId === "community" ? !e.farmId : e.farmId === farmId))).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <>
      <PageHeader eyebrow="Events" title="Upcoming farm & community events">Sample events for demonstration. Confirm details with the host before attending.</PageHeader>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <label className="block max-w-xs">
          <span className="label">Filter</span>
          <select className="input" value={farmId} onChange={(e) => setFarmId(e.target.value)}>
            <option value="">All events</option>
            <option value="community">Community events</option>
            {farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <div className="mt-6 grid gap-4">
          {list.map((e) => <EventCard key={e.id} event={e} />)}
          {!list.length && <p className="card p-6 text-center text-muted-foreground">No upcoming events match.</p>}
        </div>
      </div>
    </>
  );
}
