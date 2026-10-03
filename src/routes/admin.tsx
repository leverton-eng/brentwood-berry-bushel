import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, CalendarDays, Sprout, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Role } from "@/data/types";
import { EventManager, FarmEditor } from "@/components/FarmEditor";
import { PageHeader, StatusBadge, UpdatedNote } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { MONTHS, daysSince, isStale } from "@/lib/farm-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Brentwood U-Pick Connect" },
      { name: "description", content: "Administer farms, produce, events, users and content freshness." },
      { property: "og:title", content: "Admin Dashboard" },
      { property: "og:description", content: "Manage Brentwood U-Pick Connect content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "farms", label: "Farms", icon: Sprout },
  { id: "produce", label: "Produce", icon: Sprout },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "users", label: "Users", icon: Users },
  { id: "review", label: "Review", icon: AlertTriangle },
] as const;
type Tab = (typeof TABS)[number]["id"];

function AdminPage() {
  const s = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [editId, setEditId] = useState<string | null>(null);

  if (s.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Administrator access</h1>
        <p className="mt-2 text-muted-foreground">Admins only. In this demo, switch to the sample admin account.</p>
        <button className="btn-primary mt-6" onClick={() => s.set((x) => ({ ...x, currentUserId: "u-admin-1" }))}>Continue as Alex Admin</button>
      </div>
    );
  }

  const stale = s.farms.filter((f) => isStale(f.lastUpdated));
  const unverified = s.farms.filter((f) => !f.verified).length + s.events.filter((e) => !e.verified).length;
  const editing = s.farms.find((f) => f.id === editId);

  return (
    <>
      <PageHeader eyebrow="Administrator" title="Admin dashboard">Manage farms, events, users and keep information accurate.</PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setEditId(null); }} className={cn("btn-outline shrink-0", tab === id && "bg-primary text-primary-foreground hover:bg-primary")}><Icon className="h-4 w-4" />{label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                ["Page views", s.usage.pageViews], ["Searches", s.usage.searches], ["Chat questions", s.usage.chatQuestions], ["Saved farms", s.bookmarks.length],
                ["Farms", s.farms.length], ["Events", s.events.length], ["Needs review", stale.length], ["Unverified records", unverified],
              ].map(([l, v]) => (
                <div key={l} className="card p-4"><p className="text-xs font-semibold uppercase text-muted-foreground">{l}</p><p className="font-display text-3xl font-bold">{v}</p></div>
              ))}
            </div>
            <div className="card p-5">
              <h2 className="text-lg font-semibold">Farm profile views</h2>
              <div className="mt-4 space-y-2">
                {s.farms.map((f) => {
                  const v = s.usage.farmViews[f.id] ?? 0;
                  const max = Math.max(1, ...Object.values(s.usage.farmViews));
                  return (
                    <div key={f.id} className="flex items-center gap-3 text-sm">
                      <span className="w-48 truncate">{f.name}</span>
                      <div className="h-3 flex-1 rounded-full bg-muted"><div className="h-3 rounded-full bg-leaf" style={{ width: `${(v / max) * 100}%` }} /></div>
                      <span className="w-8 text-right font-semibold">{v}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Usage is counted in this browser only (demo). Connect a backend for site-wide reporting.</p>
            </div>
            <button className="btn-outline" onClick={() => { s.reset(); toast("Demo data reset"); }}>Reset demo data</button>
          </div>
        )}

        {tab === "farms" && (editing ? (
          <div>
            <button className="btn-ghost mb-4" onClick={() => setEditId(null)}>← All farms</button>
            <h2 className="mb-4 text-2xl font-semibold">{editing.name}</h2>
            <FarmEditor farm={editing} showVerify />
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {s.farms.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <Link to="/farms/$farmId" params={{ farmId: f.id }} className="font-semibold hover:underline">{f.name}</Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2"><StatusBadge status={f.status} /><UpdatedNote iso={f.lastUpdated} />{!f.verified && <span className="chip">Unverified</span>}</div>
                </div>
                <button className="btn-outline" onClick={() => setEditId(f.id)}>Edit</button>
              </div>
            ))}
          </div>
        ))}

        {tab === "produce" && (
          <div className="card overflow-x-auto p-4">
            <table className="w-full min-w-[560px] text-sm">
              <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="py-2">Produce</th><th>Season months</th><th>Visitor tip</th></tr></thead>
              <tbody>
                {s.produce.map((p) => (
                  <tr key={p.id} className="border-t border-border align-top">
                    <td className="py-2 pr-2 font-medium">{p.emoji} {p.name}</td>
                    <td className="py-2 pr-2">
                      <div className="flex flex-wrap gap-1">
                        {MONTHS.map((m, i) => {
                          const on = p.months.includes(i + 1);
                          return <button key={m} onClick={() => s.set((x) => ({ ...x, produce: x.produce.map((y) => (y.id === p.id ? { ...y, months: on ? y.months.filter((n) => n !== i + 1) : [...y.months, i + 1].sort((a, b) => a - b) } : y)) }))} className={cn("rounded px-1.5 py-0.5 text-[11px]", on ? "bg-leaf text-primary-foreground" : "bg-muted text-muted-foreground")}>{m}</button>;
                        })}
                      </div>
                    </td>
                    <td className="py-2"><input className="input" value={p.tip} onChange={(e) => s.set((x) => ({ ...x, produce: x.produce.map((y) => (y.id === p.id ? { ...y, tip: e.target.value } : y)) }))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "events" && <EventManager />}

        {tab === "users" && (
          <div className="card divide-y divide-border">
            {s.users.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
                <div className="flex-1"><p className="font-semibold">{u.name}</p><p className="text-muted-foreground">{u.email}</p></div>
                <select className="input w-auto" value={u.role} onChange={(e) => s.set((x) => ({ ...x, users: x.users.map((y) => (y.id === u.id ? { ...y, role: e.target.value as Role } : y)) }))} aria-label={`Role for ${u.name}`}>
                  <option value="visitor">Visitor</option><option value="farmer">Farmer</option><option value="admin">Admin</option>
                </select>
                {u.role === "farmer" && (
                  <select className="input w-auto" value={u.farmId ?? ""} onChange={(e) => s.set((x) => ({ ...x, users: x.users.map((y) => (y.id === u.id ? { ...y, farmId: e.target.value || undefined } : y)) }))} aria-label="Assigned farm">
                    <option value="">No farm</option>{s.farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "review" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Farms not updated in 30+ days, and all records still marked as sample data.</p>
            {s.farms.filter((f) => isStale(f.lastUpdated) || !f.verified).map((f) => (
              <div key={f.id} className="card flex flex-wrap items-center gap-3 p-4">
                <AlertTriangle className={cn("h-5 w-5", isStale(f.lastUpdated) ? "text-accent" : "text-muted-foreground")} />
                <div className="flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{isStale(f.lastUpdated) ? `Stale — ${daysSince(f.lastUpdated)} days since update. ` : ""}{!f.verified ? "Unverified sample data." : ""}</p>
                </div>
                <button className="btn-outline" onClick={() => { s.updateFarm(f.id, {}); toast.success("Marked as reviewed"); }}>Mark reviewed</button>
                <button className="btn-primary" onClick={() => { setTab("farms"); setEditId(f.id); }}>Correct info</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
