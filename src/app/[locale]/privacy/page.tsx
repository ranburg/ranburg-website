import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import { SITE } from "@/lib/siteConfig";
import EmailLink from "@/components/contact/EmailLink";

export const metadata = buildMetadata({
  title: "Privacy Policy | Ranburg LLP",
  description: "Privacy policy for Ranburg.com covering analytics, cookies, Google AdSense, and data handling for visitors and clients.",
  path: "/privacy",
});

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  return (
    <div className="pb-24">
      <PageHero narrow eyebrow="Legal" title="Privacy Policy" lede="Last updated: June 2025" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="card rise-soft space-y-5 p-6 text-base leading-[1.8] text-theme-muted sm:p-10">
          <p>{SITE.name} (&quot;we&quot;, &quot;us&quot;) operates {SITE.url}. This policy explains how we collect, use, and protect information when you visit our website or contact us for Salesforce consulting services.</p>
          <h2 className="pt-4 text-2xl font-medium tracking-tight text-theme-heading">Information We Collect</h2>
          <p>We may collect your name, email, phone number, and message content when you submit our contact form. We also collect anonymized usage data through Google Analytics (page views, device type, approximate location).</p>
          <h2 className="pt-4 text-2xl font-medium tracking-tight text-theme-heading">Cookies & Advertising</h2>
          <p>We use cookies for theme preferences, analytics, and may display advertisements through Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You can opt out of personalized advertising at Google Ads Settings.</p>
          <p>When advertising is enabled, we may also use the Meta (Facebook) Pixel to measure visits from social campaigns. Meta may set cookies for that purpose. You can limit this with browser tracking protection or Meta ad settings.</p>
          <h2 className="pt-4 text-2xl font-medium tracking-tight text-theme-heading">Tool Data</h2>
          <p>Our free online tools (calculators, formatters, Salesforce generators) process data entirely in your browser. We do not store or transmit tool inputs to our servers.</p>
          <h2 className="pt-4 text-2xl font-medium tracking-tight text-theme-heading">Contact</h2>
          <p>Questions about this policy: <EmailLink className="text-accent hover:underline" /></p>
        </div>
      </div>
    </div>
  );
}
