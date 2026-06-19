"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ToolConfig } from "@/lib/toolsConfig";

interface ToolSeoContentProps {
  tool: ToolConfig;
}

export default function ToolSeoContent({ tool }: ToolSeoContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <article className="mt-16 space-y-12 border-t border-white/[0.06] pt-16">
      <section>
        <h2 className="text-2xl font-bold text-white">How to Use the {tool.title}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-400">
          {tool.howToUse.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white">Formula & Logic</h2>
        <p className="mt-4 leading-relaxed text-slate-400">{tool.formula}</p>
      </section>

      <section itemScope itemType="https://schema.org/FAQPage">
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-3">
          {tool.faq.map((item, i) => (
            <div
              key={i}
              className="glass-card overflow-hidden"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                itemProp="name"
              >
                <span className="font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p className="border-t border-white/[0.06] px-5 py-4 text-sm leading-relaxed text-slate-400" itemProp="text">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
