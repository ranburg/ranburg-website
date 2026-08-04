"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  TOOLS_EXPLAINER_SCENES,
  TOOLS_EXPLAINER_VIDEO_SRC,
} from "@/lib/toolsVideoBanner";

const SCENE_MS = 4200;

/**
 * Homepage product explainer banner.
 * Prefers a real MP4 at TOOLS_EXPLAINER_VIDEO_SRC when available;
 * otherwise runs an animated scene reel (same message, no video file required).
 */
export default function ToolsVideoBanner() {
  const [mode, setMode] = useState<"checking" | "video" | "motion">("checking");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let settled = false;
    const settle = (next: "video" | "motion") => {
      if (cancelled || settled) return;
      settled = true;
      setMode(next);
    };

    const video = document.createElement("video");
    video.preload = "metadata";
    video.addEventListener("loadeddata", () => settle("video"), { once: true });
    video.addEventListener("error", () => settle("motion"), { once: true });
    video.src = `${TOOLS_EXPLAINER_VIDEO_SRC}?v=1`;

    const t = window.setTimeout(() => settle("motion"), 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  useEffect(() => {
    if (mode !== "motion" || paused) return;
    const id = window.setInterval(() => {
      setSceneIndex((i) => (i + 1) % TOOLS_EXPLAINER_SCENES.length);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [mode, paused]);

  const scene = TOOLS_EXPLAINER_SCENES[sceneIndex];

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return (
    <section className="relative border-y border-theme-subtle/60 bg-[var(--surface)] py-10 sm:py-14" aria-label="Ranburg tools explainer">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_20%,rgba(15,118,110,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Watch how it works
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-theme-heading sm:text-3xl">
              Ranburg in 20 seconds
            </h2>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Skip to all tools
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-theme bg-[var(--surface-elevated)] shadow-[0_20px_50px_-28px_rgba(15,118,110,0.45)] sm:rounded-3xl">
          {mode === "video" ? (
            <div className="relative aspect-[16/9] bg-black sm:aspect-[21/9]">
              <video
                className="h-full w-full object-cover"
                src={TOOLS_EXPLAINER_VIDEO_SRC}
                autoPlay
                muted={muted}
                loop
                playsInline
                controls={false}
                poster=""
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 sm:px-6">
                <p className="text-sm font-medium text-white">
                  Free tools · No signup · ranburg.com
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    className="rounded-full bg-white/15 p-2 text-white backdrop-blur hover:bg-white/25"
                    aria-label={muted ? "Unmute video" : "Mute video"}
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <Link
                    href="/tools"
                    className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 sm:text-sm"
                  >
                    Try tools free
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
              <div className={`absolute inset-0 bg-gradient-to-br ${scene.accent} opacity-90`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.22),transparent_45%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.45))]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45 }}
                  className="relative flex h-full flex-col justify-between p-5 sm:p-8 lg:p-10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                        {scene.eyebrow}
                      </p>
                      <h3 className="mt-2 max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                        {scene.title}
                      </h3>
                      <p className="mt-3 max-w-lg text-sm text-white/85 sm:text-base">
                        {scene.detail}
                      </p>
                    </div>
                    <div className="hidden shrink-0 rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-right backdrop-blur-md sm:block">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                        {scene.metricLabel}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums text-white lg:text-3xl">
                        {scene.metric}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={scene.href}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-white/90"
                    >
                      {scene.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={togglePause}
                        className="rounded-full bg-white/15 p-2 text-white backdrop-blur hover:bg-white/25"
                        aria-label={paused ? "Play explainer" : "Pause explainer"}
                      >
                        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </button>
                      <div className="flex gap-1.5" aria-hidden>
                        {TOOLS_EXPLAINER_SCENES.map((s, i) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSceneIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === sceneIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                            aria-label={`Show scene ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress bar for current scene */}
              {!paused && mode === "motion" && (
                <motion.div
                  key={`bar-${scene.id}-${sceneIndex}`}
                  className="absolute bottom-0 left-0 h-0.5 bg-white/90"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SCENE_MS / 1000, ease: "linear" }}
                />
              )}
            </div>
          )}
        </div>

        {mode === "checking" && (
          <p className="sr-only">Loading explainer…</p>
        )}
      </div>
    </section>
  );
}
