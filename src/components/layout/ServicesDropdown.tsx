"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";
import { cn } from "@/lib/utils";

export default function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname.startsWith("/services");

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href="/services"
        className={cn(
          "relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isActive ? "text-slate-900 dark:text-white" : "text-theme-muted hover:text-slate-900 dark:hover:text-white"
        )}
      >
        Services
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        {isActive && (
          <motion.span layoutId="nav-indicator" className="absolute inset-0 -z-10 rounded-lg bg-theme-hover" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 top-full z-[60] w-[480px] pt-2">
            <div className="dropdown-panel overflow-hidden rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-1">
                {SERVICES_CONFIG.map((service) => {
                  const Icon = getServiceIcon(service.icon);
                  return (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors",
                        pathname === `/services/${service.slug}` ? "bg-accent/10 text-accent" : "text-theme-muted hover:bg-theme-surface hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{service.title}</span>
                    </Link>
                  );
                })}
              </div>
              <Link href="/services" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-center rounded-lg border border-theme-subtle py-2 text-sm font-medium text-accent hover:bg-theme-surface">
                View All Services
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
