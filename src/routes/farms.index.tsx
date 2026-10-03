import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import { FarmCard, PageHeader } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
  produce: z.string().optional().catch(undefined),
  open: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/farms/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Farm Directory — Brentwood U-Pick Connect" },
      { name: "description", content: "Browse participating Brentwood U-pick farms and filter by produce like cherries, peaches and pumpkins." },
      { property: "og:title", content: "Brentwood U-Pick Farm Directory" },
      { property: "og:description", content: "Search and filter Brentwood U-pick farms by produce and status." },
    ],
  }),
  component: Directory,
});

function Directory() {
  const { farms, produce } = useStore();
  const { q = "", produce: pf, open } = Route.useSearch();
  const nav = useNavigate({ from: "/farms/" });
  const term = q.toLowerCase().trim();

  const list = farms.filter((f) => {
    if (open && f.status !== "open") return false;
    if (pf && !f.produce.some((p) => p.produceId === pf)) return false;
    if (!term) return true;
    const names = f.produce.map((p) => produce.find((x) => x.id === p.produceId)?.name.toLowerCase() ?? "").join(" ");
    return `${f.name} ${f.description} ${f.tagline} ${names}`.toLowerCase().includes(term) || names.includes(term.replace(/s$/, ""));
  });

  return (
    <>
      <PageHeader eyebrow="Directory" title="Participating farms">Every farm listed below is sample data for demonstration. Filter by what you'd like to pick.</PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="card space-y-4 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className="input pl-9" value={q} onChange={(e) => nav({ search: (s) => ({ ...s, q: e.target.value || undefined }), replace: true })} placeholder="Search farms or produce" aria-label="Search farms" />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by produce">
            <button onClick={() => nav({ search: (s) => ({ ...s, produce: undefined }) })} className={cn("chip", !pf && "bg-primary text-primary-foreground")}>All produce</button>
            {produce.map((p) => (
              <button key={p.id} onClick={() => nav({ search: (s) => ({ ...s, produce: pf === p.id ? undefined : p.id }) })} aria-pressed={pf === p.id} className={cn("chip", pf === p.id && "bg-primary text-primary-foreground")}>
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!open} onChange={(e) => nav({ search: (s) => ({ ...s, open: e.target.checked || undefined }) })} className="h-4 w-4 accent-primary" />
            Open for picking only
          </label>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{list.length} farm{list.length === 1 ? "" : "s"} found</p>
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => <FarmCard key={f.id} farm={f} />)}
        </div>
        {!list.length && <p className="card mt-4 p-8 text-center text-muted-foreground">No farms match those filters yet. Try another produce item.</p>}
      </div>
    </>
  );
}
