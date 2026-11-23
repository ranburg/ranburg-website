import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import TeamCards from "@/components/about/TeamCards";
import ValuesGrid from "@/components/about/ValuesGrid";
import { Building2, Target, Users } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import PageHero from "@/components/ui/PageHero";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : "en";
  setRequestLocale(locale);
  const t = await getTranslations("pages");
  return buildMetadata({
    title: t("about.title"),
    description: t("about.description"),
    path: "/about",
    locale,
    keywords: ["Ranburg", "Ranburg LLP", "ranburg.com", "Salesforce consultants India"],
  });
}

const highlights = [
  {
    icon: Building2,
    title: "Registered LLP",
    description: "A legally registered Limited Liability Partnership committed to excellence.",
  },
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Empowering businesses through technology that creates lasting impact.",
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "Your success is our metric — we build partnerships, not just projects.",
  },
];

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");

  return (
    <div className="pb-24">
      <PageHero
        eyebrow="About Ranburg"
        title={<>Ranburg — free tools &amp; digital excellence</>}
        lede={
          <>
            <strong className="font-medium text-theme-heading">Ranburg</strong> (legal name Ranburg LLP) runs{" "}
            <a href="https://www.ranburg.com" className="text-accent underline-offset-2 hover:underline">
              ranburg.com
            </a>
            : free browser tools for finance, creators, and developers, plus Salesforce consulting from {SITE.address.formatted}. Phone:{" "}
            <a href={`tel:${SITE.phoneTel}`} className="text-accent underline-offset-2 hover:underline">
              {SITE.phone}
            </a>
            .
          </>
        }
      />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="card spotlight group p-6 sm:p-8"
                  data-reveal="up"
                  style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-light tabular-nums text-accent">0{i + 1}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:border-accent/50 group-hover:text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-medium text-theme-heading">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-theme-muted sm:text-base">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center" data-reveal="up">
            <h2 className="section-heading">Our Leadership</h2>
            <p className="section-lede mt-4">Meet the founding partners driving Ranburg&apos;s vision forward.</p>
          </div>
          <TeamCards />
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center" data-reveal="up">
            <h2 className="section-heading">Our Values</h2>
            <p className="section-lede mt-4">The principles that guide every project we undertake.</p>
          </div>
          <ValuesGrid />
        </div>
      </section>
    </div>
  );
}
