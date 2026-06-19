import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service | Ranburg LLP",
  description: "Terms of service for Ranburg.com including disclaimers for financial calculators and Salesforce developer tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h1 className="text-4xl font-bold text-theme-heading">Terms of Service</h1>
        <p className="mt-4 text-theme-muted">Last updated: June 2025</p>
        <div className="mt-10 space-y-6 text-theme-muted leading-relaxed">
          <p>By using Ranburg.com, you agree to these terms. If you do not agree, please do not use the website.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Professional Services</h2>
          <p>Salesforce consulting engagements are governed by separate statements of work. Website content is for informational purposes and does not constitute a binding offer.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Free Tools Disclaimer</h2>
          <p>Financial calculators and Salesforce developer tools are provided &quot;as is&quot; without warranty. Results are estimates only. Financial tools do not constitute investment or tax advice. Salesforce tools do not replace certified implementation review.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Intellectual Property</h2>
          <p>All website content, branding, and tool implementations are owned by Ranburg LLP unless otherwise stated. You may not scrape, copy, or redistribute content without written permission.</p>
          <h2 className="text-xl font-semibold text-theme-heading">Limitation of Liability</h2>
          <p>Ranburg LLP is not liable for decisions made based on website tools or content. Maximum liability is limited to fees paid for direct consulting services in the preceding twelve months.</p>
        </div>
      </div>
    </div>
  );
}
