import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealVariant = "up" | "left" | "right" | "scale" | "fade";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

/**
 * Server-rendered wrapper that marks content for scroll-reveal.
 * Emits plain HTML (crawlers and no-JS visitors see everything); `MotionEffects` animates it in.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  id,
  style,
}: RevealProps) {
  const merged = delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style;
  return (
    <Tag id={id} data-reveal={variant} className={className} style={merged}>
      {children}
    </Tag>
  );
}
