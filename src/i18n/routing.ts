import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "pt", "hi", "ar", "ja", "ko"] as const;
export type AppLocale = (typeof locales)[number];

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  hi: "हिन्दी",
  ar: "العربية",
  ja: "日本語",
  ko: "한국어",
};

export const localeOgMap: Record<AppLocale, string> = {
  en: "en_IN",
  es: "es_ES",
  pt: "pt_BR",
  hi: "hi_IN",
  ar: "ar_SA",
  ja: "ja_JP",
  ko: "ko_KR",
};

export const rtlLocales = new Set<AppLocale>(["ar"]);

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Keep English URLs stable for SEO — do not redirect by Accept-Language cookie.
  localeDetection: false,
});

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

export function localizedPath(locale: AppLocale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalized === "" ? "/" : normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
