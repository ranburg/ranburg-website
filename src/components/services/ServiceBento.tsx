"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";

const spans = ["lg:col-span-2", "", "", "lg:col-span-2", "", "", "", "lg:col-span-2", "", "lg:col-span-3"];

export default function ServiceBento() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              className="card spotlight group relative block h-full overflow-hidden p-6 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/50 sm:p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`} />
              <div className="relative">
                <div className="mb-8 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110 ${service.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h2 className="text-xl font-medium tracking-tight text-theme-heading transition-colors group-hover:text-accent sm:text-2xl">{service.title}</h2>
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
