"use client";

import { useTranslations } from "next-intl";
import ToolSearch from "@/components/tools/ToolSearch";
import { useCommandPaletteOptional } from "@/components/search/CommandPaletteProvider";

export default function HeroSearch() {
  const t = useTranslations("home");
  const palette = useCommandPaletteOptional();

  return (
    <>
      <ToolSearch
        showSuggestions
        showTags
        maxResults={6}
        enableKeyboardNav
        trackSearches
        placeholder="Search EMI, SIP, GST, PDF, JSON…"
      />
      <button
        type="button"
        onClick={() => palette?.setOpen(true)}
        className="mt-2 text-xs text-theme-subtle transition hover:text-accent"
      >
        {t("searchHint")}
      </button>
    </>
  );
}
