import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  priority?: boolean;
};

/**
 * Official Ranburg mark from Documents/Ranburg/assets.
 * Light pages use the dark-stroke mark; dark pages use the teal mark.
 */
export default function BrandLogo({ className, markClassName }: BrandLogoProps) {
  return (
    <span className={cn("relative inline-flex h-9 w-9 shrink-0 items-center justify-center", className)}>
      <img
        src="/brand/ranburg-mark-on-light.svg"
        alt=""
        width={36}
        height={36}
        className={cn("h-9 w-9 dark:hidden", markClassName)}
      />
      <img
        src="/brand/ranburg-mark.svg"
        alt=""
        width={36}
        height={36}
        className={cn("hidden h-9 w-9 dark:block", markClassName)}
      />
    </span>
  );
}
