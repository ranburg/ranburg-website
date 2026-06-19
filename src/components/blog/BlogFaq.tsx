"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { BlogFaq as BlogFaqType } from "@/lib/blogConfig";

export default function BlogFaq({ faq }: { faq: BlogFaqType[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-16" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold text-theme-heading">FAQ</h2>
      <div className="mt-6 space-y-3">
        {faq.map((item, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left">
              <span className="font-medium text-theme-heading">{item.question}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
                  <p className="border-t border-theme-subtle px-5 py-4 text-sm text-theme-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
