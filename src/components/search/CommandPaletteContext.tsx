"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const value: CommandPaletteContextValue = {
    open,
    setOpen,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false),
  };

  return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>;
}

export function useCommandPaletteContext() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPaletteContext must be used within CommandPaletteProvider");
  return ctx;
}

/** Optional hook — returns null outside provider (for optional mobile button) */
export function useCommandPaletteOptional() {
  return useContext(CommandPaletteContext);
}
