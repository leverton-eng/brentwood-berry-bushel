import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EventManager, FarmEditor } from "@/components/FarmEditor";
import { PageHeader, StatusBadge } from "@/components/ui-bits";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/farmer")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — Brentwood U-Pick Connect" },
      { name: "description", content: "Farmers update their farm profile, hours, produce availability and events." },
      { property: "og:title", content: "Farmer Dashboard" },
      { property: "og:description", content: "Keep your U-pick farm information fresh for visitors." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FarmerPage,
});

function FarmerPage() {
  const { currentUser, farms, users, set } = useStore();
  const [tab, setTab] = useState<"farm" | "events">("farm");
  const farm = farms.find((f) => f.id === currentUser.farmId);

  if (currentUser.role !== "farmer" || !farm) {
    const farmers = users.filter((u) => u.role === "farmer");
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Farmer sign-in</h1>
        <p className="mt-2 text-muted-foreground">This dashboard is for farm owners. In this demo, choose a sample farmer account to continue.</p>
        <div className="mt-6 grid gap-2">
          {farmers.map((u) => <button key={u.id} className="btn-primary" onClick={() => set((s) => ({ ...s, currentUserId: u.id }))}>Continue as {u.name}</button>)}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow={`Farmer dashboard · ${currentUser.name}`} title={farm.name}>
        <span className="inline-flex items-center gap-2"><StatusBadge status={farm.status} /> Keep your hours and harvest status current so visitors arrive at the right time.</span>
      </PageHeader>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex gap-2" role="tablist">
          {(["farm", "events"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("btn-outline", tab === t && "bg-primary text-primary-foreground hover:bg-primary")}>{t === "farm" ? "Farm info" : "Events"}</button>
          ))}
        </div>
        {tab === "farm" ? <FarmEditor farm={farm} /> : <EventManager farmId={farm.id} />}
      </div>
    </>
  );
}
