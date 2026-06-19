"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TOOLS_CONFIG, type ToolCategoryId } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import ToolsSidebar from "@/components/tools/ToolsSidebar";

export default function ToolsHub() {
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId | "all">("all");

  const filtered =
    activeCategory === "all"
      ? TOOLS_CONFIG
      : TOOLS_CONFIG.filter((t) => t.category === activeCategory);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <ToolsSidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((tool, i) => {
              const Icon = getToolIcon(tool.icon);
              return (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/tools/${tool.slug}`} className="group block h-full">
                    <div className="glass-card relative h-full overflow-hidden p-6 transition-all group-hover:border-accent/30">
                      <div
                        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`}
                      />
                      <div className="relative">
                        <div
                          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                          {tool.badge}
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-theme-heading group-hover:text-accent transition-colors">
                          {tool.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-theme-muted line-clamp-2">
                          {tool.shortDescription}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
                          Open Tool
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">No tools in this category yet.</p>
        )}
      </div>
    </div>
  );
}
