import { Share2 } from "lucide-react";
import { shareContent } from "@/lib/share";

export function ShareButton({ title, text, url, label = "Share", className = "btn-outline w-full", iconOnly = false }: {
  title: string; text: string; url?: string; label?: string; className?: string; iconOnly?: boolean;
}) {
  return (
    <button type="button" className={className} aria-label={label} onClick={() => shareContent({ title, text, url })}>
      <Share2 className="h-4 w-4" />{!iconOnly && <> {label}</>}
    </button>
  );
}
