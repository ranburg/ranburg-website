import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";

export const metadata = buildMetadata({
  title: "Privacy Policy | Ranburg LLP",
  description: "Privacy policy for Ranburg.com covering analytics, cookies, Google AdSense, and data handling for visitors and clients.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h1 className="text-4xl font-bold text-theme-heading">Privacy Policy</h1>
        <p className="mt-4 text-theme-muted">Last updated: June 2025</p>
        <div className="mt-10 space-y-6 text-theme-muted leading-relaxed">
          <p>{SITE.name} (&quot;we&quot;, &quot;us&quot;) operates {SITE.url}. This policy explains how we collect, use, and protect information when you visit our website or contact us for Salesforce consulting services.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Information We Collect</h2>
          <p>We may collect your name, email, phone number, and message content when you submit our contact form. We also collect anonymized usage data through Google Analytics (page views, device type, approximate location).</p>
          <h2 className="text-xl font-semibold text-theme-heading">Cookies & Advertising</h2>
          <p>We use cookies for theme preferences, analytics, and may display advertisements through Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You can opt out of personalized advertising at Google Ads Settings.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Tool Data</h2>
          <p>Our free online tools (calculators, formatters, Salesforce generators) process data entirely in your browser. We do not store or transmit tool inputs to our servers.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Contact</h2>
          <p>Questions about this policy: <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">{SITE.email}</a></p>
        </div>
      </div>
    </div>
  );
}
