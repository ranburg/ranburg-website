import Link from "next/link";
import Button from "@/components/ui/Button";

interface ConsultingCTAProps {
  className?: string;
  variant?: "default" | "compact";
}

export default function ConsultingCTA({ className, variant = "default" }: ConsultingCTAProps) {
  if (variant === "compact") {
    return (
      <div className={className}>
        <p className="text-sm text-theme-muted">
          Need custom software or Salesforce consulting?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Contact Ranburg →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <section className={className}>
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-accent-emerald/5 p-8 text-center sm:p-10">
        <h2 className="text-2xl font-bold text-theme-heading sm:text-3xl">
          Need custom software or Salesforce consulting?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-theme-muted">
          Ranburg LLP builds production Salesforce, OmniStudio, and web solutions for businesses worldwide.
          Free tools are just the start — let&apos;s talk about your project.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/contact" size="lg" icon>
            Contact Ranburg
          </Button>
          <Button href="/services" variant="outline" size="lg">
            View Services
          </Button>
        </div>
      </div>
    </section>
  );
}
