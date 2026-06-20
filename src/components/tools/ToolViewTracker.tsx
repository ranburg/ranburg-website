"use client";

import { useEffect } from "react";
import { trackToolView, trackPageExit } from "@/lib/toolAnalytics";

export default function ToolViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackToolView(slug);
    const onExit = () => trackPageExit(slug);
    window.addEventListener("pagehide", onExit);
    return () => window.removeEventListener("pagehide", onExit);
  }, [slug]);
  return null;
}
