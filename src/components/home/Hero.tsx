"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Cloud,
  Shield,
  TrendingUp,
} from "lucide-react";

const floatingCards = [
  { icon: Code2, label: "Custom Dev", delay: 0, x: -120, y: -80 },
  { icon: Cloud, label: "Cloud Native", delay: 0.2, x: 140, y: -60 },
  { icon: Shield, label: "Enterprise", delay: 0.4, x: -100, y: 100 },
  { icon: TrendingUp, label: "FinTech Tools", delay: 0.6, x: 130, y: 90 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Animated orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse-glow rounded-full bg-accent-emerald/10 blur-3xl" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-32">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent"
          >
            <Sparkles className="h-4 w-4" />
            Premium IT Consulting & Development
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-gradient">Engineering</span>
            <br />
            <span className="text-gradient-accent">Next-Gen Digital</span>
            <br />
            <span className="text-gradient">Solutions</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-theme-muted lg:mx-0">
            Ranburg LLP partners with ambitious businesses to architect scalable
            software, modernize cloud infrastructure, and drive measurable digital
            transformation — backed by enterprise-grade expertise.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button href="/contact" size="lg" icon>
              Get a Free Consultation
            </Button>
            <Button href="/tools" variant="outline" size="lg">
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-bold text-theme-heading">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3D-like floating cards */}
        <div className="relative mt-16 hidden h-[420px] w-full max-w-md flex-1 lg:mt-0 lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute h-72 w-72 rounded-full border border-accent/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute h-56 w-56 rounded-full border border-dashed border-accent-emerald/20"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="glass-card absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 p-6 text-center"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-emerald">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-theme-heading">Ranburg LLP</h3>
            <p className="mt-1 text-xs text-theme-muted">Digital Excellence</p>
          </motion.div>

          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 1,
                  x: card.x,
                  y: card.y,
                }}
                transition={{ delay: 0.8 + card.delay, duration: 0.8 }}
                className="glass-card absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 px-4 py-3"
                style={{ animation: `float 6s ease-in-out ${i * 0.5}s infinite` }}
              >
                <Icon className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-slate-200">{card.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
