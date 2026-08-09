import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { toClientMessages } from "@/lib/i18n/clientMessages";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommandPaletteProvider from "@/components/search/CommandPaletteProvider";
import { PersonaProvider } from "@/components/persona/PersonaProvider";
import LocaleHtmlAttrs from "@/components/i18n/LocaleHtmlAttrs";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  websiteJsonLd,
  localBusinessJsonLd,
} from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Prerender English only; other locales generate on first request (cuts ISR fan-out ~7×). */
export function generateStaticParams() {
  return [{ locale: routing.defaultLocale }];
}

export const dynamicParams = true;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  // Omit tools.meta (~153KB) and tools.ui (~62KB) from the global client payload.
  const clientMessages = toClientMessages(messages, { includeToolUi: false });
  const fontClass =
    locale === "hi"
      ? "font-hi"
      : locale === "ar"
        ? "font-ar"
        : locale === "ja"
          ? "font-ja"
          : locale === "ko"
            ? "font-ko"
            : "";

  return (
    <NextIntlClientProvider messages={clientMessages}>
      <LocaleHtmlAttrs locale={locale as AppLocale} />
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]} />
      <PersonaProvider>
        <CommandPaletteProvider>
          <div className={fontClass || undefined}>
            <Navbar />
            <main className="pt-[var(--nav-height)]">{children}</main>
            <Footer />
          </div>
        </CommandPaletteProvider>
      </PersonaProvider>
    </NextIntlClientProvider>
  );
}
