"use client";

import { useEffect, useRef } from "react";
import { trackToolView, trackPageExit } from "@/lib/toolAnalytics";
import { trackToolOpen, trackToolDwell, trackToolEngage, trackToolResult } from "@/lib/ga";

export default function ToolViewTracker({ slug }: { slug: string }) {
  const startedAt = useRef(typeof performance !== "undefined" ? performance.now() : Date.now());
  const engaged = useRef(false);
  const resultSent = useRef(false);

  useEffect(() => {
    startedAt.current = typeof performance !== "undefined" ? performance.now() : Date.now();
    engaged.current = false;
    resultSent.current = false;

    trackToolView(slug);
    trackToolOpen(slug);

    const markEngage = (detail: string) => {
      if (engaged.current) return;
      engaged.current = true;
      trackToolEngage(slug, detail);
    };

    const onPointer = () => markEngage("pointer");
    const onKey = () => markEngage("keyboard");
    const onChange = () => {
      markEngage("change");
      if (!resultSent.current) {
        resultSent.current = true;
        trackToolResult(slug, "input_change");
      }
    };

    // Scope to the interactive tool area when present; fall back to document.
    const root =
      document.querySelector<HTMLElement>("[data-tool-interactive]") ?? document;

    root.addEventListener("pointerdown", onPointer, { once: true, passive: true });
    root.addEventListener("keydown", onKey, { once: true });
    root.addEventListener("change", onChange);
    root.addEventListener("input", onChange);

    const onExit = () => {
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const dwellMs = Math.max(0, now - startedAt.current);
      trackPageExit(slug, dwellMs);
      trackToolDwell(slug, dwellMs);
    };

    window.addEventListener("pagehide", onExit);
    return () => {
      root.removeEventListener("pointerdown", onPointer);
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("change", onChange);
      root.removeEventListener("input", onChange);
      window.removeEventListener("pagehide", onExit);
    };
  }, [slug]);

  return null;
}
