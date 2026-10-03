import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { VISITOR_GUIDE } from "@/data/sample-data";
import type { VisitPlan } from "@/data/types";
import { FarmCard, PageHeader, StatusBadge, UpdatedNote } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { DAYS, formatEventDate } from "@/lib/farm-utils";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan Your Visit — Brentwood U-Pick Connect" },
      { name: "description", content: "Save farms, build a U-pick day plan and get a preparation checklist for Brentwood farms." },
      { property: "og:title", content: "Plan a Brentwood U-Pick Visit" },
      { property: "og:description", content: "Saved farms, visit plans and a what-to-bring guide." },
    ],
  }),
  component: PlanPage,
});

const empty = (): VisitPlan => ({ id: "", date: "", farmIds: [], partySize: 2, notes: "" });

function PlanPage() {
  const { farms, bookmarks, plans, set } = useStore();
  const saved = farms.filter((f) => bookmarks.includes(f.id));
  const [draft, setDraft] = useState<VisitPlan>(empty());

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.date || !draft.farmIds.length) { toast.error("Pick a date and at least one farm."); return; }
    const plan = { ...draft, id: draft.id || crypto.randomUUID() };
    set((s) => ({ ...s, plans: s.plans.some((p) => p.id === plan.id) ? s.plans.map((p) => (p.id === plan.id ? plan : p)) : [...s.plans, plan] }));
    toast.success(draft.id ? "Visit updated" : "Visit planned");
    setDraft(empty());
  };

  return (
    <>
      <PageHeader eyebrow="Plan a visit" title="Your picking day, sorted">Save favorite farms, plan a visit and check what you need before heading out.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="section-title">Saved farms</h2>
            {saved.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{saved.map((f) => <FarmCard key={f.id} farm={f} />)}</div>
              : <p className="card mt-4 p-6 text-muted-foreground">No saved farms yet. Tap the bookmark on any <Link to="/farms" className="font-semibold text-primary underline">farm card</Link>.</p>}
          </section>

          <section className="card p-5">
            <h2 className="text-xl font-semibold">{draft.id ? "Update visit" : "Plan a new visit"}</h2>
            <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
              <label><span className="label">Date</span><input type="date" className="input" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} required /></label>
              <label><span className="label">Party size</span><input type="number" min={1} className="input" value={draft.partySize} onChange={(e) => setDraft({ ...draft, partySize: +e.target.value })} /></label>
              <fieldset className="sm:col-span-2">
                <legend className="label">Farms</legend>
                <div className="flex flex-wrap gap-2">
                  {farms.map((f) => {
                    const on = draft.farmIds.includes(f.id);
                    return (
                      <label key={f.id} className={`chip cursor-pointer ${on ? "bg-primary text-primary-foreground" : ""}`}>
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => setDraft({ ...draft, farmIds: on ? draft.farmIds.filter((x) => x !== f.id) : [...draft.farmIds, f.id] })} />
                        {f.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <label className="sm:col-span-2"><span className="label">Notes</span><textarea className="input min-h-20" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="e.g. bring cooler, lunch in downtown" /></label>
              <div className="flex gap-2 sm:col-span-2">
                <button className="btn-primary">{draft.id ? "Save changes" : "Add visit"}</button>
                {draft.id && <button type="button" className="btn-ghost" onClick={() => setDraft(empty())}>Cancel</button>}
              </div>
            </form>
          </section>

          <section>
            <h2 className="section-title">Planned visits</h2>
            <div className="mt-4 space-y-4">
              {!plans.length && <p className="card p-6 text-muted-foreground">No visits planned yet.</p>}
              {[...plans].sort((a, b) => a.date.localeCompare(b.date)).map((p) => {
                const dow = DAYS[(new Date(p.date + "T12:00:00").getDay() + 6) % 7]!;
                return (
                  <div key={p.id} className="card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{formatEventDate(p.date)} · {p.partySize} people</h3>
                      <div className="flex gap-1">
                        <button className="btn-ghost p-2" aria-label="Edit visit" onClick={() => setDraft(p)}><Pencil className="h-4 w-4" /></button>
                        <button className="btn-ghost p-2" aria-label="Delete visit" onClick={() => set((s) => ({ ...s, plans: s.plans.filter((x) => x.id !== p.id) }))}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    {p.notes && <p className="mt-1 text-sm text-muted-foreground">{p.notes}</p>}
                    <ul className="mt-3 space-y-2">
                      {p.farmIds.map((id) => {
                        const f = farms.find((x) => x.id === id);
                        if (!f) return null;
                        const hrs = f.hours[dow.key];
                        const ok = f.status === "open" && !!hrs;
                        return (
                          <li key={id} className="rounded-xl border border-border p-3 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              {ok ? <CheckCircle2 className="h-4 w-4 text-leaf" /> : <AlertTriangle className="h-4 w-4 text-accent" />}
                              <Link to="/farms/$farmId" params={{ farmId: id }} className="font-semibold hover:underline">{f.name}</Link>
                              <StatusBadge status={f.status} />
                            </div>
                            <p className="mt-1 text-muted-foreground">{dow.label}: {hrs ?? "No listed hours"} · {f.payment.join(", ")}</p>
                            <UpdatedNote iso={f.lastUpdated} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          {VISITOR_GUIDE.map((g) => (
            <div key={g.title} className="card p-5">
              <h2 className="text-lg font-semibold">{g.title}</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{g.items.map((i) => <li key={i} className="flex gap-2"><span className="text-leaf">✓</span>{i}</li>)}</ul>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
