import { toast } from "sonner";

// Shares text + link via the native share sheet when available, else copies to clipboard.
export async function shareContent(opts: { title: string; text: string; url?: string }) {
  const url = opts.url ?? (typeof window !== "undefined" ? window.location.href : "");
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  if (nav?.share) {
    try {
      await nav.share({ title: opts.title, text: opts.text, url });
      return;
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
    }
  }
  try {
    await nav?.clipboard.writeText(`${opts.text}\n\n${url}`);
    toast.success("Copied to clipboard — paste it into a text or email.");
  } catch {
    toast.error("Couldn't share automatically. Please copy the page link.");
  }
}
