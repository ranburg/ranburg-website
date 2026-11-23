import { Link } from "@/i18n/navigation";
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
    "bg-accent text-on-accent hover:shadow-[0_0_44px_color-mix(in_srgb,var(--accent)_45%,transparent)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  secondary:
    "btn-dot border border-theme-subtle bg-theme-surface text-theme-heading hover:border-transparent active:scale-[0.98]",
  ghost: "text-theme-body hover:bg-theme-hover hover:text-theme-heading",
  outline:
    "border border-theme bg-transparent text-theme-heading hover:border-accent/50 hover:bg-accent/10 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
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
    "group/btn inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 ease-out-expo",
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {variant === "secondary" && <span className="status-dot" aria-hidden />}
      {children}
      {icon && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
