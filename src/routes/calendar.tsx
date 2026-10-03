import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { MONTHS } from "@/lib/farm-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Harvest Calendar — Brentwood U-Pick Connect" },
      { name: "description", content: "Approximate harvest months for cherries, peaches, corn, pumpkins and more in Brentwood, CA." },
      { property: "og:title", content: "Brentwood Harvest Calendar" },
      { property: "og:description", content: "See what may be ripe for picking month by month in Brentwood." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { produce, farms } = useStore();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const ripe = produce.filter((p) => p.months.includes(month));

  return (
    <>
      <PageHeader eyebrow="Harvest calendar" title="What's ripe, and when">Approximate seasons for Brentwood. Weather shifts harvests by weeks — always check the farm's latest update.</PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Choose month">
          {MONTHS.map((m, i) => (
            <button key={m} role="tab" aria-selected={month === i + 1} onClick={() => setMonth(i + 1)} className={cn("chip shrink-0 px-4 py-2 text-sm", month === i + 1 && "bg-primary text-primary-foreground")}>{m}</button>
          ))}
        </div>
        <section className="mt-6">
          <h2 className="section-title">Possibly in season in {MONTHS[month - 1]}</h2>
          {ripe.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ripe.map((p) => {
                const at = farms.filter((f) => f.produce.some((fp) => fp.produceId === p.id));
                return (
                  <div key={p.id} className="card p-4">
                    <p className="text-lg font-semibold">{p.emoji} {p.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.tip}</p>
                    <Link to="/farms" search={{ produce: p.id }} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">{at.length} farm{at.length === 1 ? "" : "s"} grow this →</Link>
                  </div>
                );
              })}
            </div>
          ) : <p className="card mt-4 p-6 text-muted-foreground">Little is typically available for U-pick this month. Check back in spring!</p>}
        </section>

        <section className="card mt-10 overflow-x-auto p-4">
          <h2 className="mb-4 text-xl font-semibold">Full season at a glance</h2>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr><th className="py-2 text-left font-semibold">Produce</th>{MONTHS.map((m, i) => <th key={m} className={cn("py-2 text-center text-xs font-semibold text-muted-foreground", month === i + 1 && "text-accent")}>{m}</th>)}</tr>
            </thead>
            <tbody>
              {produce.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="whitespace-nowrap py-2 pr-3 font-medium">{p.emoji} {p.name}</td>
                  {MONTHS.map((m, i) => (
                    <td key={m} className="px-0.5 py-2"><div className={cn("h-5 rounded", p.months.includes(i + 1) ? "bg-leaf" : "bg-muted", month === i + 1 && "ring-2 ring-sun")} aria-label={p.months.includes(i + 1) ? `${p.name} in ${m}` : undefined} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
