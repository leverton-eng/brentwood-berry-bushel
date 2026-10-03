// Client-side demo store. Persists edits to localStorage so the MVP works without a backend.
// Swap these actions for real API calls when a database is added.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { EVENTS, FARMS, PRODUCE, USERS } from "@/data/sample-data";
import type { AppUser, Farm, FarmEvent, Flag, Produce, Role, VisitPlan } from "@/data/types";

interface State {
  farms: Farm[];
  events: FarmEvent[];
  produce: Produce[];
  users: AppUser[];
  bookmarks: string[];
  plans: VisitPlan[];
  flags: Flag[];
  currentUserId: string;
  usage: { pageViews: number; searches: number; chatQuestions: number; farmViews: Record<string, number> };
}

const initial: State = {
  farms: FARMS, events: EVENTS, produce: PRODUCE, users: USERS,
  bookmarks: [], plans: [], flags: [], currentUserId: "u-visitor-1",
  usage: { pageViews: 0, searches: 0, chatQuestions: 0, farmViews: {} },
};
const KEY = "upick-connect-v1";

type Ctx = State & {
  role: Role;
  currentUser: AppUser;
  set: (fn: (s: State) => State) => void;
  updateFarm: (id: string, patch: Partial<Farm>) => void;
  upsertEvent: (e: FarmEvent) => void;
  deleteEvent: (id: string) => void;
  toggleBookmark: (id: string) => void;
  track: (k: "pageViews" | "searches" | "chatQuestions", farmId?: string) => void;
  reset: () => void;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const set = useCallback((fn: (s: State) => State) => setState(fn), []);
  const now = () => new Date().toISOString();
  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? state.users[0];

  const value: Ctx = {
    ...state,
    role: currentUser.role,
    currentUser,
    set,
    updateFarm: (id, patch) => set((s) => ({ ...s, farms: s.farms.map((f) => (f.id === id ? { ...f, ...patch, lastUpdated: now() } : f)) })),
    upsertEvent: (e) => set((s) => {
      const ev = { ...e, lastUpdated: now() };
      return { ...s, events: s.events.some((x) => x.id === e.id) ? s.events.map((x) => (x.id === e.id ? ev : x)) : [...s.events, ev] };
    }),
    deleteEvent: (id) => set((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),
    toggleBookmark: (id) => set((s) => ({ ...s, bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] })),
    track: (k, farmId) => set((s) => ({
      ...s,
      usage: { ...s.usage, [k]: s.usage[k] + 1, farmViews: farmId ? { ...s.usage.farmViews, [farmId]: (s.usage.farmViews[farmId] ?? 0) + 1 } : s.usage.farmViews },
    })),
    reset: () => setState(initial),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside StoreProvider");
  return c;
}
