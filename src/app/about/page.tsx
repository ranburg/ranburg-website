import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import TeamCards from "@/components/about/TeamCards";
import ValuesGrid from "@/components/about/ValuesGrid";
import { Building2, Target, Users } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About Ranburg LLP | Salesforce Consultants in India",
  description:
    "Ranburg LLP is a Jaipur-based Salesforce consulting firm specializing in OmniStudio, Revenue Cloud, Industries Cloud, and enterprise integrations.",
  path: "/about",
  keywords: ["Ranburg LLP", "Salesforce consultants India", "Jaipur Salesforce partner"],
});

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

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              About Ranburg
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
              Pioneering <span className="text-gradient-accent">Digital Excellence</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-theme-muted">
              Ranburg.com is a registered Limited Liability Partnership (LLP) dedicated
              to delivering cutting-edge IT services and digital transformation. We combine
              deep technical expertise with strategic business insight to help organizations
              thrive in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-card p-6">
                  <Icon className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="text-lg font-semibold text-theme-heading">{item.title}</h3>
                  <p className="mt-2 text-sm text-theme-muted">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-theme-heading">Our Leadership</h2>
            <p className="mt-4 text-theme-muted">
              Meet the founding partners driving Ranburg&apos;s vision forward.
            </p>
          </div>
          <TeamCards />
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-theme-heading">Our Values</h2>
            <p className="mt-4 text-theme-muted">
              The principles that guide every project we undertake.
            </p>
          </div>
          <ValuesGrid />
        </div>
      </section>
    </div>
  );
}
