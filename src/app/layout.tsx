import type { Metadata } from "next";
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
  title: "Salesforce Consulting, Revenue Cloud & Software Development Services | Ranburg LLP",
  description:
    "Certified Salesforce consultants in India. OmniStudio, Revenue Cloud, Industries Cloud, LWC, integrations & free developer tools.",
  path: "/",
  keywords: [
    "Salesforce consulting India",
    "Salesforce developer Jaipur",
    "OmniStudio consultant",
    "Revenue Cloud implementation",
    "Salesforce Industries",
    "Ranburg LLP",
  ],
});

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ranburg-theme');var d=t?(t==='dark'):true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans">
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd()]} />
        <Providers>
          <CommandPaletteProvider>
            <Navbar />
            <main className="pt-[73px]">{children}</main>
            <Footer />
          </CommandPaletteProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
