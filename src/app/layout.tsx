import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ranburg.com | Next-Gen IT Solutions & Digital Transformation",
    template: "%s | Ranburg.com",
  },
  description:
    "Ranburg LLP delivers premium IT consulting, custom software development, cloud architecture, and innovative financial tools. Engineering next-gen digital solutions.",
  keywords: [
    "IT services",
    "software development",
    "cloud architecture",
    "digital transformation",
    "Ranburg LLP",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen font-sans">
        <Navbar />
        <main className="pt-[73px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
