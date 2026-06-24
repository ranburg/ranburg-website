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
          Explore more free tools on Ranburg.{" "}
          <Link href="/tools" className="font-medium text-accent hover:underline">
            Browse all tools →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <section className={className}>
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-accent-emerald/5 p-8 text-center sm:p-10">
        <h2 className="text-2xl font-bold text-theme-heading sm:text-3xl">
          More free tools to explore
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-theme-muted">
          Calculators, formatters, SEO utilities, PDF tools, and Salesforce admin helpers —
          all free, browser-based, and ready to use.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/tools" size="lg" icon>
            Browse All Tools
          </Button>
          <Button href="/blog" variant="outline" size="lg">
            Read Guides
          </Button>
        </div>
      </div>
    </section>
  );
}
