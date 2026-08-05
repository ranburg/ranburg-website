"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type SlideId = "emi" | "sip" | "gst" | "youtube" | "invoice" | "compress";

const SLIDES: { id: SlideId; title: string; subtitle: string; href: string; cta: string }[] = [
  { id: "emi", title: "EMI calculator", subtitle: "Loan → monthly payment", href: "/tools/emi", cta: "Open EMI tool" },
  { id: "sip", title: "SIP returns", subtitle: "Monthly investing growth", href: "/tools/sip", cta: "Open SIP tool" },
  { id: "gst", title: "GST calculator", subtitle: "Inclusive & exclusive tax", href: "/tools/gst-calculator", cta: "Open GST tool" },
  { id: "youtube", title: "YouTube revenue", subtitle: "Views × RPM estimate", href: "/tools/youtube-revenue-calculator", cta: "Open YouTube tool" },
  { id: "invoice", title: "Invoice generator", subtitle: "Logo, colors, multi-country", href: "/tools/invoice-generator", cta: "Open invoice tool" },
  { id: "compress", title: "Image compressor", subtitle: "Shrink files in-browser", href: "/tools/image-compressor", cta: "Open compressor" },
];

function fmtInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function ToolPlayground() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index];

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="border-y border-theme bg-[var(--surface-elevated)]/40 py-16" aria-label="Interactive tool playground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Try before you leave</p>
            <h2 className="mt-2 text-3xl font-bold text-theme-heading sm:text-4xl">
              Live tool <span className="text-gradient-accent">playground</span>
            </h2>
            <p className="mt-2 max-w-xl text-theme-muted">
              Scrub a few inputs, see an instant result, then open the full tool. Manual controls — nothing auto-hijacks your scroll.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-theme-surface text-theme-heading"
              aria-label={paused ? "Resume hint" : "Pause hint"}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-theme-surface text-theme-heading"
              aria-label="Previous tool"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-theme-surface text-theme-heading"
              aria-label="Next tool"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex flex-col gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition",
                  i === index
                    ? "border-accent/40 bg-accent/10 text-theme-heading"
                    : "border-theme bg-theme-surface/60 text-theme-muted hover:border-accent/25"
                )}
              >
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs opacity-80">{s.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-surface p-6 shadow-sm sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{slide.title}</p>
                <p className="mt-1 text-lg font-bold text-theme-heading">{slide.subtitle}</p>
                <div className="mt-6">
                  <MiniWidget id={slide.id} />
                </div>
                <Link
                  href={slide.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  {slide.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
            {!paused && (
              <p className="mt-4 text-xs text-theme-subtle">Hover pauses the panel so you can play with the numbers.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniWidget({ id }: { id: SlideId }) {
  if (id === "emi") return <EmiMini />;
  if (id === "sip") return <SipMini />;
  if (id === "gst") return <GstMini />;
  if (id === "youtube") return <YtMini />;
  if (id === "invoice") return <InvoiceMini />;
  return <CompressMini />;
}

function EmiMini() {
  const [loan, setLoan] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return loan / n;
    return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [loan, rate, years]);
  return (
    <div className="space-y-3">
      <MiniSlider label="Loan" display={fmtInr(loan)} value={loan} min={100000} max={10000000} step={50000} onChange={setLoan} />
      <MiniSlider label="Rate" display={`${rate.toFixed(1)}%`} value={rate} min={5} max={18} step={0.1} onChange={setRate} />
      <MiniSlider label="Years" display={`${years}`} value={years} min={1} max={30} step={1} onChange={setYears} />
      <Result value={fmtInr(emi)} label="Monthly EMI" />
    </div>
  );
}

function SipMini() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const future = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }, [monthly, rate, years]);
  return (
    <div className="space-y-3">
      <MiniSlider label="Monthly SIP" display={fmtInr(monthly)} value={monthly} min={500} max={100000} step={500} onChange={setMonthly} />
      <MiniSlider label="Expected return" display={`${rate}%`} value={rate} min={4} max={20} step={0.5} onChange={setRate} />
      <MiniSlider label="Years" display={`${years}`} value={years} min={1} max={30} step={1} onChange={setYears} />
      <Result value={fmtInr(future)} label="Estimated corpus" />
    </div>
  );
}

function GstMini() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const tax = (amount * rate) / 100;
  return (
    <div className="space-y-3">
      <MiniSlider label="Amount" display={fmtInr(amount)} value={amount} min={100} max={500000} step={100} onChange={setAmount} />
      <MiniSlider label="GST %" display={`${rate}%`} value={rate} min={0} max={28} step={1} onChange={setRate} />
      <Result value={fmtInr(amount + tax)} label={`Total with ${rate}% GST`} />
    </div>
  );
}

function YtMini() {
  const [views, setViews] = useState(1000000);
  const [rpm, setRpm] = useState(2.5);
  const revenue = (views / 1000) * rpm;
  return (
    <div className="space-y-3">
      <MiniSlider label="Views" display={views.toLocaleString()} value={views} min={1000} max={10000000} step={1000} onChange={setViews} />
      <MiniSlider label="RPM ($)" display={`$${rpm.toFixed(2)}`} value={rpm} min={0.5} max={12} step={0.1} onChange={setRpm} />
      <Result value={fmtUsd(revenue)} label="Est. ad revenue" />
    </div>
  );
}

function InvoiceMini() {
  const [qty, setQty] = useState(2);
  const [rate, setRate] = useState(5000);
  const [gst, setGst] = useState(18);
  const sub = qty * rate;
  const tax = (sub * gst) / 100;
  return (
    <div className="space-y-3">
      <MiniSlider label="Qty" display={`${qty}`} value={qty} min={1} max={20} step={1} onChange={setQty} />
      <MiniSlider label="Rate" display={fmtInr(rate)} value={rate} min={100} max={50000} step={100} onChange={setRate} />
      <MiniSlider label="GST %" display={`${gst}%`} value={gst} min={0} max={28} step={1} onChange={setGst} />
      <Result value={fmtInr(sub + tax)} label="Invoice total" />
    </div>
  );
}

function CompressMini() {
  const [kb, setKb] = useState(2400);
  const [quality, setQuality] = useState(75);
  const estimated = Math.max(80, Math.round(kb * (quality / 100) * 0.55));
  return (
    <div className="space-y-3">
      <MiniSlider label="Original size (KB)" display={`${kb} KB`} value={kb} min={200} max={8000} step={50} onChange={setKb} />
      <MiniSlider label="Quality" display={`${quality}%`} value={quality} min={40} max={95} step={1} onChange={setQuality} />
      <Result value={`~${estimated} KB`} label="Estimated output" />
    </div>
  );
}

function MiniSlider({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-theme-muted">{label}</span>
        <span className="font-semibold tabular-nums text-theme-heading">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function Result({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-accent/25 bg-accent/5 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-theme-heading">{value}</p>
    </div>
  );
}
