"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Cloud,
  Building2,
  Smartphone,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Code2,
    title: "Custom Software Development",
    description:
      "Bespoke applications engineered to your exact specifications — from internal tools to customer-facing platforms with clean architecture and maintainable codebases.",
    span: "lg:col-span-2",
    accent: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Cloud,
    title: "Cloud Architecture & DevOps",
    description:
      "Design, migrate, and optimize cloud infrastructure on AWS, Azure, and GCP with CI/CD pipelines and infrastructure-as-code.",
    span: "",
    accent: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    icon: Building2,
    title: "Enterprise Solutions & CRM Integration",
    description:
      "Seamless Salesforce, HubSpot, and ERP integrations that unify your business data and automate workflows.",
    span: "",
    accent: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: Smartphone,
    title: "Web & Mobile App Engineering",
    description:
      "Responsive web apps and native-quality mobile experiences built with React, Next.js, React Native, and modern frameworks.",
    span: "lg:col-span-2",
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Lightbulb,
    title: "IT Consulting & Strategy",
    description:
      "Technology assessments, digital roadmaps, and strategic advisory to align IT investments with business outcomes.",
    span: "lg:col-span-3",
    accent: "from-amber-500/20 to-amber-600/5",
  },
];

export default function ServiceBento() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card group relative overflow-hidden p-8 ${service.span}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="relative">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-all group-hover:bg-accent/20 group-hover:shadow-glow">
                  <Icon className="h-6 w-6 text-accent transition-transform group-hover:scale-110" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-600 transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-xl font-bold text-theme-heading">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-theme-muted">
                {service.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ServicesCTA() {
  return (
    <div className="mt-16 text-center">
      <p className="text-theme-muted">
        Ready to discuss your project?{" "}
        <Link href="/contact" className="font-medium text-accent hover:underline">
          Get in touch with our team →
        </Link>
      </p>
    </div>
  );
}
