import { Link } from "@tanstack/react-router";
import { Menu, Sprout, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/farms", label: "Farms" },
  { to: "/map", label: "Map" },
  { to: "/calendar", label: "Harvest" },
  { to: "/events", label: "Events" },
  { to: "/plan", label: "Plan a Visit" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { users, currentUserId, set, role } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Sprout className="h-5 w-5" /></span>
          <span className="font-display text-lg font-semibold leading-none">Brentwood<br className="sm:hidden" /><span className="text-accent"> U-Pick</span> Connect</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-full px-3 py-2 text-sm font-medium hover:bg-secondary" activeProps={{ className: "bg-secondary text-primary" }}>{n.label}</Link>
          ))}
          {role === "farmer" && <Link to="/farmer" className="rounded-full px-3 py-2 text-sm font-semibold text-accent hover:bg-secondary">Farmer Dashboard</Link>}
          {role === "admin" && <Link to="/admin" className="rounded-full px-3 py-2 text-sm font-semibold text-accent hover:bg-secondary">Admin</Link>}
        </nav>
        <label className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground sm:flex lg:ml-2">
          <span className="sr-only md:not-sr-only">Demo role</span>
          <select className="input w-auto py-1.5 text-xs" value={currentUserId} onChange={(e) => set((s) => ({ ...s, currentUserId: e.target.value }))}>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.role}</option>)}
          </select>
        </label>
        <button className="btn-ghost ml-auto p-2 sm:ml-0 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium hover:bg-secondary" activeProps={{ className: "bg-secondary text-primary" }}>{n.label}</Link>
            ))}
            {role === "farmer" && <Link to="/farmer" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold text-accent">Farmer Dashboard</Link>}
            {role === "admin" && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold text-accent">Admin Dashboard</Link>}
            <label className="mt-2 block sm:hidden">
              <span className="label">Demo role</span>
              <select className="input" value={currentUserId} onChange={(e) => set((s) => ({ ...s, currentUserId: e.target.value }))}>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.role}</option>)}
              </select>
            </label>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted-foreground md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-foreground">Brentwood U-Pick Connect</p>
          <p className="mt-2">A community guide to picking your own in Brentwood, California.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="hover:text-foreground">{n.label}</Link>)}
        </div>
        <p>All farms, hours and events shown are <strong className="text-foreground">sample data</strong> for demonstration and are not verified. Always confirm with the farm before visiting.</p>
      </div>
    </footer>
  );
}
