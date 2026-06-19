"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Sparkles, Cloud, Layers, DollarSign, Zap } from "lucide-react";

const floatingCards = [
  { icon: Cloud, label: "Sales Cloud", delay: 0, x: -120, y: -80 },
  { icon: Layers, label: "OmniStudio", delay: 0.2, x: 140, y: -60 },
  { icon: DollarSign, label: "Revenue Cloud", delay: 0.4, x: -100, y: 100 },
  { icon: Zap, label: "LWC & APIs", delay: 0.6, x: 130, y: 90 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse-glow rounded-full bg-accent-emerald/10 blur-3xl" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-32">
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
            Certified Salesforce Partner · Jaipur, India
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-gradient">Salesforce</span>
            <br />
            <span className="text-gradient-accent">Consulting &</span>
            <br />
            <span className="text-gradient">Development</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-theme-muted lg:mx-0">
            Ranburg LLP delivers OmniStudio, Revenue Cloud, Industries Cloud, LWC, and
            enterprise integrations — plus free Salesforce developer tools trusted by admins worldwide.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button href="/contact" size="lg" icon>Schedule Consultation</Button>
            <Button href="/contact" variant="outline" size="lg">Contact Us</Button>
          </div>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button href="/services" variant="outline" size="lg">
              Discuss Your Salesforce Project
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/tools/salesforce" variant="outline" size="lg">
              Free Salesforce Tools
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
            {[
              { value: "10+", label: "Salesforce Clouds" },
              { value: "OmniStudio", label: "Specialists" },
              { value: "Jaipur", label: "India HQ" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-bold text-theme-heading">{stat.value}</div>
                <div className="text-sm text-theme-subtle">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative mt-16 hidden h-[420px] w-full max-w-md flex-1 lg:mt-0 lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute h-72 w-72 rounded-full border border-accent/10" />
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-card absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 -translate-y-1/2 p-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-emerald">
              <Cloud className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-theme-heading">Ranburg LLP</h3>
            <p className="mt-1 text-xs text-theme-subtle">Salesforce Excellence</p>
          </motion.div>
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} initial={{ opacity: 0 }} animate={{ opacity: 1, x: card.x, y: card.y }} transition={{ delay: 0.8 + card.delay }} className="glass-card absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 px-4 py-3" style={{ animation: `float 6s ease-in-out ${i * 0.5}s infinite` }}>
                <Icon className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-theme-body">{card.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
