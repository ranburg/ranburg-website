import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import EmailLink from "@/components/contact/EmailLink";
import { SITE } from "@/lib/siteConfig";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

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
            <div className="flex items-start gap-3 rounded-xl border border-theme bg-theme-surface/60 p-4">
              <Mail className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">Email</p>
                <p className="mt-1 text-sm text-theme-heading">
                  <EmailLink className="hover:text-accent" />
                </p>
              </div>
            </div>
            <a href={`tel:${SITE.phoneTel}`} className="flex items-start gap-3 rounded-xl border border-theme bg-theme-surface/60 p-4">
              <Phone className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">Phone</p>
                <p className="mt-1 text-sm text-theme-heading">{SITE.phone}</p>
              </div>
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl border border-theme bg-theme-surface/60 p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">Address</p>
                <p className="mt-1 text-sm text-theme-heading">{SITE.address.formatted}</p>
              </div>
            </a>
            <div className="flex items-start gap-3 rounded-xl border border-theme bg-theme-surface/60 p-4">
              <Clock className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">Business Hours</p>
                <p className="mt-1 text-sm text-theme-heading">Mon–Fri, 9 AM – 6 PM IST</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
