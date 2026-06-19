"use client";

import CommandPalette, { useCommandPalette } from "@/components/search/CommandPalette";

export default function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const { open, setOpen, close } = useCommandPalette();

  return (
    <>
      {children}
      <CommandPalette open={open} onClose={close} />
      {/* Expose open for optional nav button — palette listens globally */}
      <span className="hidden" data-cmdk-open={open} onClick={() => setOpen(true)} />
    </>
  );
}
