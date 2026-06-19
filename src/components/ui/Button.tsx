import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: boolean;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-blue-600 text-white shadow-glow hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30 hover:bg-accent-emerald/20 hover:border-accent-emerald/50",
  ghost: "text-theme-body hover:bg-theme-hover hover:text-slate-900 dark:hover:text-slate-900 dark:hover:text-white",
  outline:
    "border border-slate-300 bg-theme-surface text-slate-900 hover:border-accent/40 hover:bg-accent/10 dark:border-white/20 dark:text-white dark:hover:border-accent/40",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {icon && <ArrowRight className="h-4 w-4" />}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      {icon && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
