"use client";

import { useLocale, useTranslations } from "next-intl";

/**
 * Resolve a tool UI string: tools.ui.{slug}.{key} with fallback to tools.ui._shared.{key} then common.
 */
export function useToolUi(slug: string) {
  const tUi = useTranslations("tools.ui");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  function t(key: string, values?: Record<string, string | number | Date>) {
    const slugKey = `${slug}.${key}`;
    const sharedKey = `_shared.${key}`;
    if (tUi.has(slugKey)) return tUi(slugKey, values);
    if (tUi.has(sharedKey)) return tUi(sharedKey, values);
    if (tCommon.has(key)) return tCommon(key, values);
    return key;
  }

  return { t, locale };
}
