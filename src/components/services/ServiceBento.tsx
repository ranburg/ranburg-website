"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";

const spans = ["lg:col-span-2", "", "", "lg:col-span-2", "", "", "", "lg:col-span-2", "", "lg:col-span-3"];

export default function ServiceBento() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES_CONFIG.map((service, i) => {
        const Icon = getServiceIcon(service.icon);
        const span = spans[i] ?? "";
        return (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={span}
          >
            <Link
              href={`/services/${service.slug}`}
              className="glass-card group relative block h-full overflow-hidden p-8 hover:border-accent/30"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`} />
              <div className="relative">
                <div className="mb-5 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <h2 className="text-xl font-bold text-theme-heading group-hover:text-accent">{service.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-theme-muted">{service.shortDescription}</p>
              </div>
            </Link>
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
        Need Salesforce expertise?{" "}
        <Link href="/contact" className="font-medium text-accent hover:underline">
          Book a free discovery call →
        </Link>
        {" · "}
        <Link href="/tools" className="font-medium text-accent hover:underline">
          Try our free Salesforce tools
        </Link>
      </p>
    </div>
  );
}
