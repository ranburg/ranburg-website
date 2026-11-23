import { Link } from "@/i18n/navigation";
import { Clock, Mail } from "lucide-react";
import type { ComingSoonTool } from "@/lib/toolComingSoonConfig";
import { SITE } from "@/lib/siteConfig";
import { breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getToolIcon } from "@/lib/toolIcons";
import { iconWell } from "@/components/tools/iconWell";

interface ToolComingSoonShellProps {
  tool: ComingSoonTool;
}

export default function ToolComingSoonShell({ tool }: ToolComingSoonShellProps) {
  const Icon = getToolIcon(tool.icon, tool.slug);
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
      <section className="pb-8 pt-8 sm:pt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Salesforce Tools", href: "/tools/salesforce" },
              { label: tool.title },
            ]}
          />
          <div className="rise flex items-start gap-4 sm:gap-5">
            <div {...iconWell(tool.gradient, "float-slow h-14 w-14 rounded-2xl")}>
              <Icon className="h-7 w-7" strokeWidth={2.25} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3" /> Coming Soon
              </span>
              <h1 className="mt-4 text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-5xl">{tool.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-theme-muted">{tool.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
          <div className="card spotlight relative overflow-hidden rounded-[1.75rem] px-6 py-12 text-center sm:px-10" data-reveal="scale">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[30rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
            <h2 className="relative text-2xl font-light tracking-tight text-theme-heading sm:text-3xl">We&apos;re building this tool</h2>
            <p className="relative mx-auto mt-3 max-w-md text-theme-muted">
              Join the waitlist and we&apos;ll notify you when {tool.title} launches — plus get early access to new Ranburg Salesforce utilities.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`mailto:${SITE.email}?subject=Waitlist: ${encodeURIComponent(tool.title)}`} size="lg" icon>
                <Mail className="h-4 w-4" /> Join Waitlist
              </Button>
              <Button href="/tools/salesforce" variant="secondary" size="lg">
                Browse Live Salesforce Tools
              </Button>
            </div>
          </div>

          <div className="card p-6 sm:p-8" data-reveal="up">
            <h2 className="text-xl font-medium tracking-tight text-theme-heading sm:text-2xl">Benefits</h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-theme-muted marker:text-accent">
              {tool.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="card p-6 sm:p-8" data-reveal="up">
            <h2 className="text-xl font-medium tracking-tight text-theme-heading sm:text-2xl">Use Cases</h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-theme-muted marker:text-accent">
              {tool.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>

          <p className="pt-4 text-sm text-theme-subtle">
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
