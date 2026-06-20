"use client";

import CommandPalette from "@/components/search/CommandPalette";
import { CommandPaletteProvider, useCommandPaletteContext } from "@/components/search/CommandPaletteContext";

function CommandPalettePortal() {
  const { open, close } = useCommandPaletteContext();
  return <CommandPalette open={open} onClose={close} />;
}

export default function CommandPaletteProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      {children}
      <CommandPalettePortal />
    </CommandPaletteProvider>
  );
}

export { useCommandPaletteContext, useCommandPaletteOptional } from "@/components/search/CommandPaletteContext";
