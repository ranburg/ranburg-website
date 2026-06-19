"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ToolConfig } from "@/lib/toolsConfig";
import { generateToolSeoSections } from "@/lib/toolSeoGenerator";

interface ToolSeoContentProps {
  tool: ToolConfig;
}

export default function ToolSeoContent({ tool }: ToolSeoContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const seo = generateToolSeoSections(tool);

  return (
    <article className="mt-16 space-y-12 border-t border-theme-subtle pt-16">
      <section>
        <h2 className="text-2xl font-bold text-theme-heading">What is the {tool.title}?</h2>
        {seo.whatIs.split("\n\n").map((para, i) => (
          <p key={i} className="mt-4 leading-relaxed text-theme-muted">
            {para}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-theme-heading">How It Works</h2>
        {seo.howItWorks.split("\n\n").map((para, i) => (
          <p key={i} className="mt-4 leading-relaxed text-theme-muted">
            {para}
          </p>
        ))}
        <h3 className="mt-8 text-lg font-semibold text-theme-heading">Step-by-Step</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-theme-muted">
          {tool.howToUse.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-theme-heading">Benefits</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-theme-muted">
          {seo.benefits.map((b) => (
            <li key={b} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-theme-heading">Common Use Cases</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-theme-muted">
          {seo.useCases.map((u) => (
            <li key={u} className="leading-relaxed">
              {u}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-theme-heading">Technical Reference</h2>
        <p className="mt-4 leading-relaxed text-theme-muted">{tool.formula}</p>
      </section>

      <section itemScope itemType="https://schema.org/FAQPage">
        <h2 className="text-2xl font-bold text-theme-heading">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-3">
          {seo.faq.map((item, i) => (
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
                <span className="font-medium text-theme-heading">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-theme-muted transition-transform ${
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
                    <p className="border-t border-theme-subtle px-5 py-4 text-sm leading-relaxed text-theme-muted" itemProp="text">
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
