import Link from "next/link";
import { Clock, Mail } from "lucide-react";
import type { ComingSoonTool } from "@/lib/toolComingSoonConfig";
import { SITE } from "@/lib/siteConfig";
import { breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getToolIcon } from "@/lib/toolIcons";

interface ToolComingSoonShellProps {
  tool: ComingSoonTool;
}

export default function ToolComingSoonShell({ tool }: ToolComingSoonShellProps) {
  const Icon = getToolIcon(tool.icon);
  const url = `${SITE.url}/tools/${tool.slug}`;

  return (
    <div className="pb-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: SITE.url },
            { name: "Salesforce Tools", url: `${SITE.url}/tools/salesforce` },
            { name: tool.title, url },
          ]),
        ]}
      />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Salesforce Tools", href: "/tools/salesforce" },
              { label: tool.title },
            ]}
          />
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3" /> Coming Soon
              </span>
              <h1 className="mt-3 text-3xl font-extrabold text-theme-heading sm:text-4xl">{tool.title}</h1>
              <p className="mt-3 text-lg text-theme-muted">{tool.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-bold text-theme-heading">We&apos;re building this tool</h2>
            <p className="mx-auto mt-3 max-w-md text-theme-muted">
              Join the waitlist and we&apos;ll notify you when {tool.title} launches — plus get early access to new Ranburg Salesforce utilities.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`mailto:${SITE.email}?subject=Waitlist: ${encodeURIComponent(tool.title)}`} size="lg" icon>
                <Mail className="h-4 w-4" /> Join Waitlist
              </Button>
              <Button href="/tools/salesforce" variant="outline" size="lg">
                Browse Live Salesforce Tools
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-theme-heading">Benefits</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-theme-muted">
              {tool.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-theme-heading">Use Cases</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-theme-muted">
              {tool.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-theme-subtle">
            Explore other free tools in the{" "}
            <Link href="/tools" className="text-accent hover:underline">
              Ranburg tools library
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
