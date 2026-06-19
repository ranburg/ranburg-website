import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ranburg LLP for IT consulting, software development, and digital transformation services.",
};

const MAPS_URL = "https://maps.app.goo.gl/Cm1m7Qv2vF5cS7vr7";

const contactInfo = [
  { icon: Mail, label: "Email", value: "admin@ranburg.com", href: "mailto:admin@ranburg.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Location", value: "View on Google Maps", href: MAPS_URL },
  { icon: Clock, label: "Business Hours", value: "Mon–Fri, 9 AM – 6 PM IST" },
];

export default function ContactPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Contact Us
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
              Let&apos;s Build Something <span className="text-gradient-accent">Great</span>
            </h1>
            <p className="mt-6 text-lg text-theme-muted">
              Have a project in mind? We&apos;d love to hear from you. Reach out and
              let&apos;s discuss how we can help transform your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="glass-card p-5 transition-all hover:border-accent/20">
                      <Icon className="mb-3 h-5 w-5 text-accent" />
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-theme-heading">{item.value}</p>
                    </div>
                  );
                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group relative block h-64 overflow-hidden transition-all hover:border-accent/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-emerald/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-3 h-10 w-10 text-accent transition-transform group-hover:scale-110" />
                    <p className="font-semibold text-theme-heading">Ranburg LLP Office</p>
                    <p className="mt-1 text-sm text-accent">Find us on Google Maps →</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-grid opacity-20" />
              </a>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
