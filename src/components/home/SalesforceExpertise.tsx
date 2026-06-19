"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cloud,
  DollarSign,
  Layers,
  Globe,
  Zap,
  Link2,
  ArrowRight,
  Code2,
} from "lucide-react";
import Button from "@/components/ui/Button";

const expertise = [
  {
    icon: Cloud,
    title: "Salesforce Consulting",
    description: "Strategy, architecture, and implementation roadmaps from certified consultants.",
    href: "/services/salesforce-consulting",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    icon: DollarSign,
    title: "Revenue Cloud",
    description: "CPQ, billing, subscription management, and quote-to-cash modernization.",
    href: "/services/revenue-cloud",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    icon: Layers,
    title: "OmniStudio",
    description: "FlexCards, OmniScripts, DataRaptors, and Integration Procedures for Industries.",
    href: "/services/omnistudio-development",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    icon: Code2,
    title: "Salesforce Industries",
    description: "Vlocity industry models for telecom, insurance, health, and financial services.",
    href: "/services/salesforce-industries",
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    icon: Globe,
    title: "Experience Cloud",
    description: "Customer and partner portals with secure, branded digital experiences.",
    href: "/services/experience-cloud",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    icon: Zap,
    title: "LWC Development",
    description: "High-performance Lightning Web Components for Sales and Service Cloud.",
    href: "/services/lwc-development",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Link2,
    title: "Integrations",
    description: "REST, platform events, MuleSoft, and enterprise API integration patterns.",
    href: "/services/salesforce-integrations",
    gradient: "from-rose-500 to-pink-600",
  },
];

export default function SalesforceExpertise() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Salesforce <span className="text-gradient-accent">Expertise</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-theme-muted">
            Ranburg LLP is a Salesforce-first consulting firm — not a general IT shop. We specialize in
            Industries Cloud, Revenue Cloud, OmniStudio, and enterprise-grade development from Jaipur, India.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {expertise.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={item.href}
                  className="glass-card group flex h-full flex-col p-6 hover:border-accent/30"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-theme-heading group-hover:text-accent">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-theme-muted">{item.description}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" size="lg" icon>Schedule Consultation</Button>
          <Button href="/contact" variant="outline" size="lg">Contact Us</Button>
          <Button href="/services" variant="outline" size="lg">
            Discuss Your Salesforce Project
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
