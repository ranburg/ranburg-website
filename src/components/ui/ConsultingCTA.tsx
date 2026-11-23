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
      <div className="card spotlight relative overflow-hidden rounded-[1.75rem] px-6 py-12 text-center sm:px-10 sm:py-16" data-reveal="scale">
        <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <h2 className="relative text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-5xl">
          More free tools to explore
        </h2>
        <p className="section-lede relative mx-auto mt-4 max-w-xl">
          Calculators, formatters, SEO utilities, PDF tools, and Salesforce admin helpers —
          all free, browser-based, and ready to use.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/tools" size="lg" icon>
            Browse All Tools
          </Button>
          <Button href="/blog" variant="secondary" size="lg">
            Read Guides
          </Button>
        </div>
      </div>
    </section>
  );
}
