"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedOptionsProps {
  children: React.ReactNode;
  className?: string;
}

export default function AdvancedOptions({ children, className }: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("border-t border-theme-subtle pt-6", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl bg-theme-surface px-4 py-3 text-sm font-medium text-theme-body transition-colors hover:bg-theme-hover hover:text-slate-900 dark:hover:text-slate-900 dark:hover:text-white"
      >
        <span className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-accent" />
          Advanced Options
        </span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
