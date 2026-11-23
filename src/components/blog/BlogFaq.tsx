"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { BlogFaq as BlogFaqType } from "@/lib/blogConfig";

export default function BlogFaq({ faq }: { faq: BlogFaqType[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-16" itemScope itemType="https://schema.org/FAQPage">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-subtle bg-theme-surface text-accent">
          <HelpCircle className="h-5 w-5" />
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-theme-heading sm:text-3xl">Frequently asked questions</h2>
      </div>
      <div className="mt-6 space-y-3">
        {faq.map((item, i) => (
          <div
            key={i}
            className={`card overflow-hidden transition-colors duration-300 ${open === i ? "border-accent/40" : "hover:border-accent/30"}`}
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start sm:px-6 sm:py-5"
            >
              <span className="font-medium text-theme-heading">{item.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                  open === i
                    ? "rotate-180 border-accent bg-accent text-on-accent"
                    : "border-theme-subtle bg-theme-surface text-theme-muted"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-theme-subtle px-5 py-4 text-sm leading-relaxed text-theme-muted sm:px-6 sm:py-5 sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
