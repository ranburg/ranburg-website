import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import EmailLink from "@/components/contact/EmailLink";
import { SITE } from "@/lib/siteConfig";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

const infoCard =
  "card spotlight flex items-start gap-4 p-5 transition-colors duration-300 hover:border-accent/40";
const infoIcon =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-theme-subtle bg-theme-surface text-accent";
const infoLabel = "text-xs font-medium uppercase tracking-[0.16em] text-theme-subtle";

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
      <PageHero
        eyebrow="Contact Us"
        title={
          <>
            Let&apos;s Build Something <span className="text-gradient-accent font-semibold">Great</span>
          </>
        }
        lede={
          <>
            Have a project in mind? We&apos;d love to hear from you. Reach out and let&apos;s discuss how we can help
            transform your business.
          </>
        }
      />

      <section className="py-8">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-3" data-reveal="left">
            <div className={infoCard}>
              <span className={infoIcon}><Mail className="h-5 w-5" /></span>
              <div>
                <p className={infoLabel}>Email</p>
                <p className="mt-1 text-sm text-theme-heading">
                  <EmailLink className="hover:text-accent" />
                </p>
              </div>
            </div>
            <a href={`tel:${SITE.phoneTel}`} className={infoCard}>
              <span className={infoIcon}><Phone className="h-5 w-5" /></span>
              <div>
                <p className={infoLabel}>Phone</p>
                <p className="mt-1 text-sm text-theme-heading">{SITE.phone}</p>
              </div>
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className={infoCard}>
              <span className={infoIcon}><MapPin className="h-5 w-5" /></span>
              <div>
                <p className={infoLabel}>Address</p>
                <p className="mt-1 text-sm text-theme-heading">{SITE.address.formatted}</p>
              </div>
            </a>
            <div className={infoCard}>
              <span className={infoIcon}><Clock className="h-5 w-5" /></span>
              <div>
                <p className={infoLabel}>Business Hours</p>
                <p className="mt-1 text-sm text-theme-heading">Mon–Fri, 9 AM – 6 PM IST</p>
              </div>
            </div>
          </div>
          <div data-reveal="right">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
