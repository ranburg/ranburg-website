"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { BlogFaq as BlogFaqType } from "@/lib/blogConfig";

export default function BlogFaq({ faq }: { faq: BlogFaqType[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-16" itemScope itemType="https://schema.org/FAQPage">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-accent" />
        <h2 className="text-2xl font-bold text-theme-heading">Frequently asked questions</h2>
      </div>
      <div className="mt-6 space-y-3">
        {faq.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-theme-subtle bg-[var(--glass-bg)]">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-theme-heading">{item.question}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-accent transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-theme-subtle px-5 py-4 text-sm leading-relaxed text-theme-muted sm:text-base">
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
