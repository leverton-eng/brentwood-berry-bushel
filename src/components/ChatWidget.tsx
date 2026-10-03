// Rule-based assistant: answers ONLY from data already in the app. No external AI calls.
import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, Sprout, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VISITOR_GUIDE } from "@/data/sample-data";
import type { Farm, Produce } from "@/data/types";
import { useStore } from "@/lib/store";
import { AVAIL_LABEL, DAYS, MONTHS, STATUS_LABEL, formatDate, formatEventDate } from "@/lib/farm-utils";

interface Msg { from: "bot" | "user"; text: string; links?: { id: string; name: string }[] }

const NOT_FOUND = "I don't have that information in Brentwood U-Pick Connect yet. Please check the farm's profile or contact the farm directly.";

export function answer(q: string, farms: Farm[], produce: Produce[], events: { title: string; date: string; location: string }[]): Msg {
  const t = q.toLowerCase();
  const farm = farms.find((f) => t.includes(f.name.toLowerCase()) || f.name.toLowerCase().split(" ").filter((w) => w.length > 4).some((w) => t.includes(w)));
  const prod = produce.find((p) => t.includes(p.name.toLowerCase()) || t.includes(p.id.replace("-", " ")) || t.includes(p.name.toLowerCase().replace(/s$/, "")));
  const upd = (f: Farm) => ` (last updated ${formatDate(f.lastUpdated)}; sample data)`;

  if (farm) {
    if (/hour|open|close|time|when/.test(t)) {
      const hrs = DAYS.filter((d) => farm.hours[d.key]).map((d) => `${d.label.slice(0, 3)} ${farm.hours[d.key]}`).join("; ");
      return { from: "bot", text: `${farm.name} is currently: ${STATUS_LABEL[farm.status]}. Listed hours: ${hrs || "not listed"}${upd(farm)}.`, links: [farm] };
    }
    if (/where|address|location|direction/.test(t)) return { from: "bot", text: `${farm.name} is listed at ${farm.address}.`, links: [farm] };
    if (/phone|contact|email|call/.test(t)) return { from: "bot", text: `Contact ${farm.name}: ${farm.phone}, ${farm.email}.`, links: [farm] };
    const items = farm.produce.map((fp) => `${produce.find((p) => p.id === fp.produceId)?.name} (${AVAIL_LABEL[fp.availability]})`).join(", ");
    return { from: "bot", text: `${farm.name}: ${STATUS_LABEL[farm.status]}. Produce: ${items}. ${farm.seasonNote}${upd(farm)}.`, links: [farm] };
  }
  if (prod) {
    const now = farms.filter((f) => f.produce.some((fp) => fp.produceId === prod.id && (fp.availability === "available" || fp.availability === "limited")));
    const any = farms.filter((f) => f.produce.some((fp) => fp.produceId === prod.id));
    const season = prod.months.map((m) => MONTHS[m - 1]).join(", ");
    if (!any.length) return { from: "bot", text: `No participating farm lists ${prod.name} right now. Typical Brentwood season: ${season}.` };
    return {
      from: "bot",
      text: `${prod.emoji} ${prod.name} typically: ${season}. ${now.length ? `Listed as available now at ${now.map((f) => f.name).join(", ")}.` : "No farm currently lists them as available."} Offered by: ${any.map((f) => f.name).join(", ")}. Availability changes quickly — confirm with the farm.`,
      links: any,
    };
  }
  if (/open (now|today)|what.*open|which.*open/.test(t)) {
    const o = farms.filter((f) => f.status === "open");
    return { from: "bot", text: o.length ? `Listed as open: ${o.map((f) => `${f.name} (updated ${formatDate(f.lastUpdated)})`).join(", ")}.` : "No farms are currently listed as open.", links: o };
  }
  if (/season|month|available|in season|pick now|harvest/.test(t)) {
    const m = new Date().getMonth() + 1;
    const inSeason = produce.filter((p) => p.months.includes(m));
    return { from: "bot", text: inSeason.length ? `Typically in season in ${MONTHS[m - 1]}: ${inSeason.map((p) => p.name).join(", ")}. See the Harvest Calendar for the full year.` : `Few crops are typically in season in ${MONTHS[m - 1]}. See the Harvest Calendar.` };
  }
  if (/event|festival|happening/.test(t)) {
    const up = events.filter((e) => e.date >= new Date().toISOString().slice(0, 10)).slice(0, 3);
    return { from: "bot", text: up.length ? `Upcoming: ${up.map((e) => `${e.title} — ${formatEventDate(e.date)} at ${e.location}`).join("; ")}.` : "No upcoming events listed." };
  }
  if (/bring|wear|prepare|tips|kid|pet|dog|etiquette/.test(t)) {
    return { from: "bot", text: VISITOR_GUIDE.map((g) => `${g.title}: ${g.items.slice(0, 3).join("; ")}`).join(" · ") + " Pet and stroller policies vary — check each farm's profile." };
  }
  if (/farm|list|all/.test(t)) return { from: "bot", text: `Participating farms (sample data): ${farms.map((f) => f.name).join(", ")}.`, links: farms };
  return { from: "bot", text: NOT_FOUND };
}

export function ChatWidget() {
  const { farms, produce, events, track } = useStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi! I'm the Harvest Helper. Ask me about farms, what's in season, hours, locations or how to prepare. I only answer from information on this site." }]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); inputRef.current?.focus(); }, [msgs, open]);

  const send = (q: string) => {
    if (!q.trim()) return;
    track("chatQuestions");
    setMsgs((m) => [...m, { from: "user", text: q }, answer(q, farms, produce, events)]);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="btn-accent fixed bottom-4 right-4 z-50 px-5 py-3 shadow-card" aria-label="Open Harvest Helper chat">
          <MessageCircle className="h-5 w-5" /> <span className="hidden sm:inline">Ask Harvest Helper</span>
        </button>
      )}
      {open && (
        <div role="dialog" aria-label="Harvest Helper" className="card fixed inset-x-2 bottom-2 z-50 flex h-[75vh] flex-col overflow-hidden sm:inset-x-auto sm:right-4 sm:bottom-4 sm:h-[560px] sm:w-[380px]">
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun text-sun-foreground"><Sprout className="h-4 w-4" /></span>
            <div className="flex-1"><p className="font-display font-semibold">Harvest Helper</p><p className="text-xs opacity-80">Answers from site data only</p></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-primary-foreground/10"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground" : "mr-4 text-sm"}>
                <p>{m.text}</p>
                {m.links && m.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.links.map((l) => <Link key={l.id} to="/farms/$farmId" params={{ farmId: l.id }} onClick={() => setOpen(false)} className="chip hover:bg-sun/40">{l.name} →</Link>)}
                  </div>
                )}
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {["What's in season now?", "Which farms are open?", "Where can I pick cherries?", "What should I bring?"].map((s) => (
                  <button key={s} onClick={() => send(s)} className="chip hover:bg-sun/40">{s}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-3">
            <input ref={inputRef} className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about farms or produce…" aria-label="Your question" />
            <button className="btn-primary px-3" aria-label="Send"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
