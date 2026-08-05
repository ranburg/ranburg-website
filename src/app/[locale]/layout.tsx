import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommandPaletteProvider from "@/components/search/CommandPaletteProvider";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
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
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlAttrs locale={locale as AppLocale} />
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]} />
      <CommandPaletteProvider>
        <div className={fontClass || undefined}>
          <Navbar />
          <main className="pt-[var(--nav-height)]">{children}</main>
          <Footer />
        </div>
      </CommandPaletteProvider>
    </NextIntlClientProvider>
  );
}
