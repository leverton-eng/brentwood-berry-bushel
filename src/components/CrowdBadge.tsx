import { Users } from "lucide-react";
import { CROWD_LABEL, type CrowdLevel } from "@/lib/crowd";
import { cn } from "@/lib/utils";

export function CrowdBadge({ level, total }: { level: CrowdLevel; total?: number }) {
  const cls = level === "busy" ? "bg-destructive text-destructive-foreground" : level === "moderate" ? "bg-sun text-sun-foreground" : "bg-leaf text-primary-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", cls)}>
      <Users className="h-3 w-3" aria-hidden />
      {CROWD_LABEL[level]}{total !== undefined && ` · ~${total}`}
    </span>
  );
}
