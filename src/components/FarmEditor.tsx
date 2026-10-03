// Shared editor used by both farmer and admin dashboards.
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Farm, FarmEvent, FarmProduceEntry } from "@/data/types";
import { useStore } from "@/lib/store";
import { AVAIL_LABEL, DAYS } from "@/lib/farm-utils";
import { EventCard, UpdatedNote } from "./ui-bits";

export function FarmEditor({ farm, showVerify }: { farm: Farm; showVerify?: boolean }) {
  const { updateFarm, produce } = useStore();
  const [f, setF] = useState<Farm>(farm);
  useEffect(() => setF(farm), [farm]);
  const save = () => { updateFarm(farm.id, f); toast.success("Farm information saved"); };
  const setProd = (id: string, a: FarmProduceEntry["availability"] | "") =>
    setF({ ...f, produce: a ? (f.produce.some((p) => p.produceId === id) ? f.produce.map((p) => (p.produceId === id ? { ...p, availability: a } : p)) : [...f.produce, { produceId: id, availability: a }]) : f.produce.filter((p) => p.produceId !== id) });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <UpdatedNote iso={farm.lastUpdated} />
        <button onClick={save} className="btn-primary">Save changes</button>
      </div>
      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <h3 className="text-lg font-semibold sm:col-span-2">Status</h3>
        <label><span className="label">Operating status</span>
          <select className="input" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Farm["status"] })}>
            <option value="open">Open for picking</option><option value="closed">Temporarily closed</option><option value="off-season">Off-season</option>
          </select>
        </label>
        <label><span className="label">Status note</span><input className="input" value={f.statusNote ?? ""} onChange={(e) => setF({ ...f, statusNote: e.target.value })} /></label>
        {showVerify && (
          <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" className="h-4 w-4 accent-primary" checked={f.verified} onChange={(e) => setF({ ...f, verified: e.target.checked })} />Mark as verified by farm (removes "Sample data" label)</label>
        )}
      </section>
      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <h3 className="text-lg font-semibold sm:col-span-2">Profile</h3>
        <label><span className="label">Farm name</span><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label><span className="label">Tagline</span><input className="input" value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Description</span><textarea className="input min-h-20" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">History</span><textarea className="input min-h-16" value={f.history} onChange={(e) => setF({ ...f, history: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Address</span><input className="input" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>
        <label><span className="label">Phone</span><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <label><span className="label">Email</span><input className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Visitor guidance (one per line)</span><textarea className="input min-h-20" value={f.guidance.join("\n")} onChange={(e) => setF({ ...f, guidance: e.target.value.split("\n").filter(Boolean) })} /></label>
      </section>
      <section className="card p-5">
        <h3 className="text-lg font-semibold">Hours</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {DAYS.map((d) => (
            <label key={d.key} className="flex items-center gap-3"><span className="w-24 text-sm font-medium">{d.label}</span>
              <input className="input" placeholder="Closed" value={f.hours[d.key] ?? ""} onChange={(e) => setF({ ...f, hours: { ...f.hours, [d.key]: e.target.value || undefined } })} />
            </label>
          ))}
        </div>
      </section>
      <section className="card p-5">
        <h3 className="text-lg font-semibold">Produce & harvest availability</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {produce.map((p) => (
            <label key={p.id} className="flex items-center gap-3"><span className="w-32 text-sm font-medium">{p.emoji} {p.name}</span>
              <select className="input" value={f.produce.find((x) => x.produceId === p.id)?.availability ?? ""} onChange={(e) => setProd(p.id, e.target.value as FarmProduceEntry["availability"] | "")}>
                <option value="">Not grown</option>
                {Object.entries(AVAIL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          ))}
        </div>
        <label className="mt-4 block"><span className="label">Season note</span><input className="input" value={f.seasonNote} onChange={(e) => setF({ ...f, seasonNote: e.target.value })} /></label>
      </section>
      <div className="flex justify-end"><button onClick={save} className="btn-primary">Save changes</button></div>
    </div>
  );
}

const blankEvent = (farmId?: string): FarmEvent => ({ id: "", title: "", date: "", time: "", farmId, location: "", description: "", verified: false, lastUpdated: "" });

export function EventManager({ farmId }: { farmId?: string }) {
  const { events, farms, upsertEvent, deleteEvent } = useStore();
  const list = events.filter((e) => farmId === undefined || e.farmId === farmId).sort((a, b) => a.date.localeCompare(b.date));
  const [d, setD] = useState<FarmEvent>(blankEvent(farmId));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!d.title || !d.date) { toast.error("Title and date are required."); return; }
    const loc = d.location || farms.find((f) => f.id === d.farmId)?.name || "";
    upsertEvent({ ...d, location: loc, id: d.id || crypto.randomUUID() });
    toast.success(d.id ? "Event updated" : "Event added");
    setD(blankEvent(farmId));
  };
  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="card grid gap-3 p-5 sm:grid-cols-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold sm:col-span-2"><Plus className="h-4 w-4" />{d.id ? "Edit event" : "Add event"}</h3>
        <label className="sm:col-span-2"><span className="label">Title</span><input className="input" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} /></label>
        <label><span className="label">Date</span><input type="date" className="input" value={d.date} onChange={(e) => setD({ ...d, date: e.target.value })} /></label>
        <label><span className="label">Time</span><input className="input" value={d.time} onChange={(e) => setD({ ...d, time: e.target.value })} placeholder="10:00 AM – 2:00 PM" /></label>
        {farmId === undefined && (
          <label><span className="label">Farm</span>
            <select className="input" value={d.farmId ?? ""} onChange={(e) => setD({ ...d, farmId: e.target.value || undefined })}>
              <option value="">Community (no farm)</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </label>
        )}
        <label><span className="label">Location</span><input className="input" value={d.location} onChange={(e) => setD({ ...d, location: e.target.value })} /></label>
        <label className="sm:col-span-2"><span className="label">Description</span><textarea className="input" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} /></label>
        <div className="flex gap-2 sm:col-span-2"><button className="btn-primary">{d.id ? "Save event" : "Add event"}</button>{d.id && <button type="button" className="btn-ghost" onClick={() => setD(blankEvent(farmId))}>Cancel</button>}</div>
      </form>
      {list.map((e) => (
        <div key={e.id} className="relative">
          <EventCard event={e} />
          <div className="absolute right-3 top-3 flex gap-1">
            <button className="btn-outline px-3 py-1 text-xs" onClick={() => setD(e)}>Edit</button>
            <button className="btn-outline px-2 py-1" aria-label="Delete event" onClick={() => { deleteEvent(e.id); toast("Event removed"); }}><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
