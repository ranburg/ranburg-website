import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** Primary = horizontal lockup. Icon = stacked mark for tight spaces. */
  variant?: "primary" | "icon";
};

/**
 * Official Ranburg lockups.
 * Light uses primary-light / stacked-light; dark uses the matching dark files.
 */
export default function BrandLogo({ className, variant = "primary" }: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <span className={cn("relative inline-flex h-9 w-9 shrink-0 items-center justify-center", className)}>
        <img
          src="/brand/ranburg-logo-stacked-light.svg"
          alt="Ranburg"
          width={36}
          height={45}
          className="h-9 w-auto dark:hidden"
        />
        <img
          src="/brand/ranburg-logo-stacked-dark.svg"
          alt=""
          width={36}
          height={45}
          className="hidden h-9 w-auto dark:block"
        />
      </span>
    );
  }

  return (
    <span className={cn("relative inline-flex h-9 items-center sm:h-10", className)}>
      <img
        src="/brand/ranburg-logo-primary-light.svg"
        alt="Ranburg LLP"
        width={137}
        height={40}
        className="h-9 w-auto sm:h-10 dark:hidden"
      />
      <img
        src="/brand/ranburg-logo-primary-dark.svg"
        alt=""
        width={137}
        height={40}
        className="hidden h-9 w-auto sm:h-10 dark:block"
      />
    </span>
  );
}
