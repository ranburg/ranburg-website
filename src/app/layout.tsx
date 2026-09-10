import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans, Noto_Sans_Arabic, Noto_Sans_Devanagari, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import Providers from "@/components/theme/Providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import { SITE } from "@/lib/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.brand,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/brand/ranburg-logo-mark-128.png", sizes: "128x128", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["400", "700"],
  preload: false,
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
  weight: ["400", "700"],
  preload: false,
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
  weight: ["400", "700"],
  preload: false,
});

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
  weight: ["400", "700"],
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EB" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

const fontVars = `${plusJakarta.variable} ${notoSans.variable} ${notoDevanagari.variable} ${notoArabic.variable} ${notoJp.variable} ${notoKr.variable}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html className={fontVars} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ranburg-theme');var d=t==='dark';document.documentElement.classList.toggle('dark',d);var p=localStorage.getItem('user_persona');if(p)document.documentElement.setAttribute('data-persona',p);var path=location.pathname.split('/').filter(Boolean)[0];var locales=['es','pt','hi','ar','ja','ko'];var loc=locales.indexOf(path)>=0?path:'en';document.documentElement.lang=loc;document.documentElement.dir=loc==='ar'?'rtl':'ltr';document.documentElement.setAttribute('data-locale',loc);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--surface-elevated)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-theme-heading focus:shadow-lg"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <GoogleAnalytics />
        <FacebookPixel />
        {adsenseClient ? (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        ) : null}
        <Analytics />
      </body>
    </html>
  );
}
