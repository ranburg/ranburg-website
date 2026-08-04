type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 custom event (no-op if gtag missing). */
export function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function trackToolOpen(slug: string): void {
  trackGaEvent("tool_open", { tool_slug: slug, page_path: `/tools/${slug}` });
}

export function trackToolResult(slug: string, detail?: string): void {
  trackGaEvent("tool_result", { tool_slug: slug, detail: detail ?? "generated" });
}

export function trackCopyOutput(slug?: string): void {
  trackGaEvent("copy_output", { tool_slug: slug ?? "unknown" });
}

export function trackDownload(slug?: string, label?: string): void {
  trackGaEvent("download", { tool_slug: slug ?? "unknown", label: label ?? "file" });
}

/** Fire when a user interacts with a tool (slider, input, file, copy). */
export function trackToolEngage(slug: string, detail?: string): void {
  trackGaEvent("tool_engage", { tool_slug: slug, detail: detail ?? "interaction" });
}

/** Dwell time when leaving a tool page (helps validate >8s engagement goal). */
export function trackToolDwell(slug: string, dwellMs: number): void {
  const seconds = Math.round(dwellMs / 1000);
  trackGaEvent("tool_dwell", {
    tool_slug: slug,
    dwell_ms: dwellMs,
    dwell_seconds: seconds,
    engaged_8s: seconds >= 8,
  });
}
