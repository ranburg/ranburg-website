import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import { SITE } from "@/lib/siteConfig";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/Cm1m7Qv2vF5cS7vr7";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : "en";
  setRequestLocale(locale);
  const t = await getTranslations("pages");
  return buildMetadata({
    title: t("contact.title"),
    description: t("contact.description"),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");

  const contactInfo = [
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneTel}` },
    { icon: MapPin, label: "Location", value: "View on Google Maps", href: MAPS_URL },
    { icon: Clock, label: "Business Hours", value: "Mon–Fri, 9 AM – 6 PM IST" },
  ];

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Contact Us</p>
            <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
              Let&apos;s Build Something <span className="text-gradient-accent">Great</span>
            </h1>
            <p className="mt-6 text-lg text-theme-muted">
              Have a project in mind? We&apos;d love to hear from you. Reach out and let&apos;s discuss how we can help
              transform your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-3 rounded-xl border border-theme bg-theme-surface/60 p-4">
                  <Icon className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">{item.label}</p>
                    <p className="mt-1 text-sm text-theme-heading">{item.value}</p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
