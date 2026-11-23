import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  gap?: string;
  className?: string;
}

/**
 * Infinite CSS marquee. The second track is a decorative duplicate
 * (aria-hidden + inert) so screen readers and crawlers read the content once.
 */
export default function Marquee({ children, duration = 40, reverse = false, gap = "3rem", className }: MarqueeProps) {
  const style = { "--marquee-duration": `${duration}s`, "--marquee-gap": gap } as CSSProperties;
  return (
    <div className={cn("marquee mask-fade-x", reverse && "marquee-reverse", className)} style={style} dir="ltr">
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden inert>
        {children}
      </div>
    </div>
  );
}
