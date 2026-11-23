"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __ranburgMotion?: boolean;
  }
}

const REVEAL_SELECTOR = "[data-reveal]:not([data-revealed])";
const COUNT_SELECTOR = "[data-countup]:not([data-counted])";

function formatCount(value: number, template: string): string {
  const decimals = (template.split(".")[1] ?? "").replace(/[^0-9]/g, "").length;
  const fixed = value.toFixed(decimals);
  return template.includes(",") ? Number(fixed).toLocaleString("en-US", { minimumFractionDigits: decimals }) : fixed;
}

function runCountUp(el: HTMLElement) {
  el.setAttribute("data-counted", "");
  const raw = el.getAttribute("data-countup") ?? "";
  const target = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(target)) return;
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = formatCount(target * eased, raw);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = raw;
  };
  requestAnimationFrame(tick);
}

/**
 * One tiny client island that powers every scroll/hover effect on the site:
 *  - `[data-reveal]`  → fades/slides in when scrolled into view
 *  - `[data-countup]` → counts up to its server-rendered value
 *  - `.spotlight`     → cursor-following glow (sets --mx / --my)
 *  - `[data-tilt]`    → subtle 3D tilt toward the pointer
 * Content is always present in the HTML; if this never runs, the inline head script
 * removes `.js-motion` so nothing stays hidden.
 */
export default function MotionEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.__ranburgMotion = true;

    if (reduced || !("IntersectionObserver" in window)) {
      root.classList.remove("js-motion");
      return;
    }
    root.classList.add("js-motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.setAttribute("data-revealed", "");
          if (el.hasAttribute("data-countup") && !el.hasAttribute("data-counted")) runCountUp(el);
          io.unobserve(el);
        }
      },
      // threshold 0: very tall blocks (long grids on phones) must still reveal as soon as they enter.
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    const scan = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(`${REVEAL_SELECTOR}, ${COUNT_SELECTOR}`).forEach((el) => io.observe(el));
    };
    scan(document);

    // Pick up content added by client-side navigation or lazy components.
    let queued = false;
    const mo = new MutationObserver((mutations) => {
      if (queued) return;
      if (!mutations.some((m) => m.addedNodes.length > 0)) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan(document);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    const applyPointer = () => {
      frame = 0;
      const e = lastEvent;
      if (!e || !(e.target instanceof Element)) return;
      const spot = e.target.closest<HTMLElement>(".spotlight");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const tilt = e.target.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = Number(tilt.dataset.tilt) || 6;
        tilt.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(applyPointer);
    };
    const onPointerOut = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      const tilt = e.target.closest<HTMLElement>("[data-tilt]");
      if (tilt && !(e.relatedTarget instanceof Node && tilt.contains(e.relatedTarget))) {
        tilt.style.transform = "";
      }
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden />;
}
