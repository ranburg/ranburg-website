import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: ReactNode;
  /** Rendered inside the page's single <h1>. */
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Narrow reading column (legal pages, 404). */
  narrow?: boolean;
}

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

/** Shared page header: pill eyebrow, large light-weight H1, lede. Animates with CSS only. */
export default function PageHero({ eyebrow, title, lede, children, className, narrow = false }: PageHeroProps) {
  return (
    <section className={cn("relative pb-10 pt-12 sm:pb-14 sm:pt-20", className)}>
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", narrow ? "max-w-3xl" : "max-w-7xl")}>
        <div className="max-w-4xl">
          {eyebrow && (
            <p className="eyebrow rise-soft">
              <span className="status-dot" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              "rise mt-6 font-light leading-[1.08] tracking-[-0.035em] text-theme-heading",
              narrow ? "text-4xl sm:text-5xl" : "text-4xl sm:text-6xl lg:text-7xl"
            )}
            style={delay(80)}
          >
            {title}
          </h1>
          {lede && (
            <p className="rise-soft mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted" style={delay(220)}>
              {lede}
            </p>
          )}
          {children && (
            <div className="rise-soft mt-8" style={delay(320)}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
