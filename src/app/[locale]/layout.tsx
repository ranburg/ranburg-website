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

/**
 * Pre-render every locale at build time so HTML/RSC is served from the CDN.
 * `force-dynamic` was a Hobby-plan workaround (ISR read units) and must not
 * return — it sends every page view through Vercel Compute and burns Fast
 * Origin Transfer (CDN to Compute).
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;
export const dynamic = "force-static";

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
            <main id="main-content" className="pt-[var(--nav-height)]">
              {children}
            </main>
            <Footer />
          </div>
        </CommandPaletteProvider>
      </PersonaProvider>
    </NextIntlClientProvider>
  );
}
