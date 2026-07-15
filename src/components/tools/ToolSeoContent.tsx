"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ToolConfig } from "@/lib/toolsConfig";
import { generateToolSeoSections } from "@/lib/toolSeoGenerator";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface ToolSeoContentProps {
  tool: ToolConfig;
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-theme-subtle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <h2 className="text-lg font-bold text-theme-heading sm:text-xl">{title}</h2>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-theme-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-theme-subtle px-5 py-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function ToolSeoContent({ tool }: ToolSeoContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const seo = generateToolSeoSections(tool);

  return (
    <article className="mt-14 space-y-3 border-t border-theme-subtle pt-10">
      <p className="mb-4 text-sm font-medium text-theme-subtle">Learn more about this tool</p>

      <CollapsibleSection title={`What is the ${tool.title}?`} defaultOpen>
        {seo.whatIs.split("\n\n").map((para, i) => (
          <p key={i} className={`${i > 0 ? "mt-4" : ""} leading-relaxed text-theme-muted`}>
            {para}
          </p>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="How It Works">
        {seo.howItWorks.split("\n\n").map((para, i) => (
          <p key={i} className={`${i > 0 ? "mt-4" : ""} leading-relaxed text-theme-muted`}>
            {para}
          </p>
        ))}
        <h3 className="mt-6 text-base font-semibold text-theme-heading">Step-by-Step</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-theme-muted">
          {tool.howToUse.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </CollapsibleSection>

      <CollapsibleSection title="Examples">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.examples.map((ex) => (
            <li key={ex} className="leading-relaxed">
              {ex}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="Benefits">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.benefits.map((b) => (
            <li key={b} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="Common Use Cases">
        <ul className="list-disc space-y-2 pl-5 text-theme-muted">
          {seo.useCases.map((u) => (
            <li key={u} className="leading-relaxed">
              {u}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="Technical Reference">
        <p className="leading-relaxed text-theme-muted">{tool.formula}</p>
      </CollapsibleSection>

      <section
        className="overflow-hidden rounded-xl border border-theme-subtle"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="px-5 py-4">
          <h2 className="text-lg font-bold text-theme-heading sm:text-xl">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-0 border-t border-theme-subtle">
          {seo.faq.map((item, i) => (
            <div
              key={i}
              className="border-b border-theme-subtle last:border-b-0"
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

      <AdPlaceholder placement="after-faq" />
    </article>
  );
}
