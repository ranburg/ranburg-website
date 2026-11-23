"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { TOOLS_EXPLAINER_SCENES } from "@/lib/toolsVideoBanner";

const SCENE_MS = 4200;

/**
 * Lightweight CSS scene reel — no auto-loading MP4 (that was the LCP bottleneck).
 * Keyword-rich first scene is in the initial HTML for crawlers and PageSpeed.
 */
export default function ToolsVideoBanner() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setSceneIndex((i) => (i + 1) % TOOLS_EXPLAINER_SCENES.length);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const scene = TOOLS_EXPLAINER_SCENES[sceneIndex];
  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return (
    <section className="relative py-16 sm:py-24" aria-label="Ranburg tools explainer">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal="up">
          <div>
            <p className="eyebrow">
              <span className="status-dot" aria-hidden />
              Free EMI, SIP, GST and PDF tools
            </p>
            <h2 className="section-heading mt-5">Calculators and converters in 20 seconds</h2>
          </div>
          <Link href="/tools" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Skip to all tools
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="card overflow-hidden rounded-[1.75rem] p-2 sm:p-3" data-reveal="scale">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[1.25rem] sm:aspect-[21/9]">
            <AnimatePresence initial={false}>
              <motion.div
                key={`bg-${scene.id}`}
                className={`absolute inset-0 bg-gradient-to-br ${scene.accent}`}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.92, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.25),transparent_45%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.1),rgba(0,0,0,0.55))]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0.35, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col justify-between p-5 sm:p-8 lg:p-12"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                      {scene.eyebrow}
                    </p>
                    <h3 className="mt-3 max-w-xl text-2xl font-medium leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-6xl">
                      {scene.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm text-white/85 sm:text-base">
                      {scene.detail}
                    </p>
                  </div>
                  <div className="hidden shrink-0 rounded-2xl border border-white/25 bg-black/25 px-5 py-4 text-end backdrop-blur-md sm:block">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                      {scene.metricLabel}
                    </p>
                    <p className="mt-1 text-2xl font-light tabular-nums text-white lg:text-4xl">
                      {scene.metric}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={scene.href}
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {scene.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
                  </Link>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={togglePause}
                      className="rounded-full bg-black/30 p-2.5 text-white backdrop-blur transition-colors hover:bg-black/50"
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
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            i === sceneIndex ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                          }`}
                          aria-label={`Show scene ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {!paused && (
              <motion.div
                key={`bar-${scene.id}-${sceneIndex}`}
                className="absolute bottom-0 left-0 h-0.5 bg-white/90"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: SCENE_MS / 1000, ease: "linear" }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
