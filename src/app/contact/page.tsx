import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ranburg LLP for IT consulting, software development, and digital transformation services.",
};

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@ranburg.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Location", value: "India" },
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
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Let&apos;s Build Something <span className="text-gradient-accent">Great</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Have a project in mind? We&apos;d love to hear from you. Reach out and
              let&apos;s discuss how we can help transform your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="glass-card p-5">
                      <Icon className="mb-3 h-5 w-5 text-accent" />
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Map placeholder */}
              <div className="glass-card relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-emerald/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-3 h-10 w-10 text-accent" />
                    <p className="font-semibold text-white">Ranburg LLP</p>
                    <p className="mt-1 text-sm text-slate-400">India</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-grid opacity-20" />
              </div>
            </div>

            {/* Right column - Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
