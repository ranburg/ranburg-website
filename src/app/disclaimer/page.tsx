import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Disclaimer | Ranburg LLP",
  description:
    "Disclaimer for Ranburg.com free online tools, calculators, and utilities. Results are estimates only — not professional advice.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h1 className="text-4xl font-bold text-theme-heading">Disclaimer</h1>
        <p className="mt-4 text-theme-muted">Last updated: June 2025</p>
        <div className="mt-10 space-y-6 leading-relaxed text-theme-muted">
          <p>
            Ranburg.com provides free online tools, calculators, formatters, and utilities for general informational and productivity purposes. By using this website, you agree to the terms below.
          </p>
          <h2 className="text-xl font-semibold text-theme-heading">No Professional Advice</h2>
          <p>
            Financial calculators, tax tools (including GST), currency converters, and business metric utilities produce indicative estimates only. They do not constitute financial, tax, legal, or investment advice. Consult qualified professionals before making financial or tax decisions.
          </p>
          <h2 className="text-xl font-semibold text-theme-heading">Tool Accuracy</h2>
          <p>
            While we strive for accuracy, Ranburg LLP makes no warranties about completeness, reliability, or suitability of tool outputs. Salesforce developer generators produce starting templates that must be reviewed in a sandbox before production deployment.
          </p>
          <h2 className="text-xl font-semibold text-theme-heading">Privacy & Data</h2>
          <p>
            Most tools process data locally in your browser. See our{" "}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link> for details on analytics and contact form data.
          </p>
          <h2 className="text-xl font-semibold text-theme-heading">External Links & APIs</h2>
          <p>
            Some tools fetch third-party data (e.g., live exchange rates). Ranburg is not responsible for third-party service availability or accuracy.
          </p>
          <h2 className="text-xl font-semibold text-theme-heading">Limitation of Liability</h2>
          <p>
            Ranburg LLP is not liable for damages arising from use of free tools or website content. Maximum liability for paid consulting services is governed by separate agreements.
          </p>
          <p>
            Questions: <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">{SITE.email}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
