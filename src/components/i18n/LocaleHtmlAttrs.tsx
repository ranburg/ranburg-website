"use client";

import { useEffect } from "react";
import { rtlLocales, type AppLocale } from "@/i18n/routing";

export default function LocaleHtmlAttrs({ locale }: { locale: string }) {
  useEffect(() => {
    const dir = rtlLocales.has(locale as AppLocale) ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  return null;
}
