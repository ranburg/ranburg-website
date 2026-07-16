import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/theme/Providers";
import CommandPaletteProvider from "@/components/search/CommandPaletteProvider";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, localBusinessJsonLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Free Online Tools — Calculators, Converters & Developer Utilities | Ranburg LLP",
  description:
    "Free online tools for developers, businesses, and SEO professionals. Calculators, formatters, generators, and Salesforce utilities by Ranburg LLP.",
  path: "/",
  keywords: [
    "free online tools",
    "developer tools",
    "SEO tools",
    "calculators online",
    "Salesforce tools",
    "Ranburg LLP",
  ],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} dark`} suppressHydrationWarning>
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaMeasurementId}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaMeasurementId}');`,
          }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ranburg-theme');var d=t?(t==='dark'):true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden font-sans antialiased">
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd()]} />
        <Providers>
          <CommandPaletteProvider>
            <Navbar />
            <main className="pt-[var(--nav-height)]">{children}</main>
            <Footer />
          </CommandPaletteProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
