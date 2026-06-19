"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Cloud,
  Building2,
  Smartphone,
  Lightbulb,
  Calculator,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";

const services = [
  {
    icon: Code2,
    title: "Custom Software",
    description: "Tailored applications built for your unique business logic.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Scalable infrastructure with automated deployment pipelines.",
  },
  {
    icon: Building2,
    title: "Enterprise Solutions",
    description: "CRM integration and enterprise-grade system architecture.",
  },
  {
    icon: Smartphone,
    title: "Web & Mobile",
    description: "Beautiful, performant apps across every platform.",
  },
  {
    icon: Lightbulb,
    title: "IT Strategy",
    description: "Technology roadmaps aligned with your growth objectives.",
  },
  {
    icon: Calculator,
    title: "Financial Tools",
    description: "Free SIP, SWP, and EMI calculators to plan smarter.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            What We <span className="text-gradient-accent">Deliver</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-theme-muted">
            End-to-end IT services designed to accelerate your digital journey
            from concept to production.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={item}
                className="glass-card group p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Icon className="h-6 w-6 text-accent transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-semibold text-theme-heading">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-theme-muted">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-12 text-center">
          <Button href="/services" variant="outline" icon>
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card relative overflow-hidden p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-emerald/5" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-theme-muted">
              Let&apos;s discuss how Ranburg LLP can architect the technology
              foundation for your next chapter of growth.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contact" size="lg" icon>
                Schedule a Consultation
              </Button>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-glow"
              >
                Try our free financial tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
