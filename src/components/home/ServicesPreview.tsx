"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";

const preview = SERVICES_CONFIG.slice(0, 6);

export default function ServicesPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Salesforce <span className="text-gradient-accent">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-theme-muted">
            End-to-end Salesforce consulting from strategy through implementation, managed services, and staff augmentation.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((service, i) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <motion.div key={service.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link href={`/services/${service.slug}`} className="glass-card group block h-full p-6 hover:border-accent/30">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-theme-heading group-hover:text-accent">{service.title}</h3>
                  <p className="mt-2 text-sm text-theme-muted line-clamp-2">{service.shortDescription}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/services" variant="outline" icon>View All Services</Button>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card relative overflow-hidden p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-emerald/5" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">Start Your Salesforce Journey</h2>
            <p className="mx-auto mt-4 max-w-xl text-theme-muted">
              Book a free discovery call with certified Salesforce consultants in Jaipur, India.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contact" size="lg" icon>Schedule a Consultation</Button>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                Read Salesforce insights <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
