import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/theme/Providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, localBusinessJsonLd, buildMetadata } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Salesforce Consulting & Development Services | Ranburg LLP",
  description:
    "Certified Salesforce consultants in Jaipur, India. OmniStudio, Revenue Cloud, Industries Cloud, LWC, integrations, and managed services.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ranburg-theme');var d=t?(t==='dark'):true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans">
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd()]} />
        <GoogleAnalytics />
        <Providers>
          <Navbar />
          <main className="pt-[73px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
