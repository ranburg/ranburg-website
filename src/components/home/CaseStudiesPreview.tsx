"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import Button from "@/components/ui/Button";
import { CASE_STUDIES } from "@/lib/caseStudiesConfig";

export default function CaseStudiesPreview() {
  const preview = CASE_STUDIES.slice(0, 3);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Client <span className="text-gradient-accent">Success Stories</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-theme-muted">
            Revenue Cloud, OmniStudio, Industries, and integration outcomes from Ranburg Salesforce programs worldwide.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {preview.map((study, i) => (
            <motion.div key={study.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link href={`/case-studies/${study.slug}`} className="glass-card group flex h-full flex-col p-6 hover:border-accent/30">
                <Briefcase className="h-8 w-8 text-accent" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-theme-subtle">{study.industry}</p>
                <h3 className="mt-2 text-lg font-semibold text-theme-heading group-hover:text-accent">{study.title}</h3>
                <p className="mt-2 flex-1 text-sm text-theme-muted line-clamp-3">{study.excerpt}</p>
                <span className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
                  Read story <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/case-studies" variant="outline" icon>View All Case Studies</Button>
        </div>
      </div>
    </section>
  );
}
