"use client";

import { cn } from "@/lib/utils";

export function SerpPreview({
  title,
  description,
  url,
  className,
}: {
  title: string;
  description: string;
  url: string;
  className?: string;
}) {
  const displayUrl = url.replace(/^https?:\/\//, "") || "example.com/page";
  return (
    <div className={cn("rounded-xl border border-theme-subtle bg-white p-4 dark:bg-[#202124]", className)}>
      <p className="text-xs text-[#202124]/90 dark:text-[#bdc1c6]">{displayUrl}</p>
      <p className="mt-1 line-clamp-1 text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Page title"}</p>
      <p className="mt-1 line-clamp-2 text-sm text-[#4d5156] dark:text-[#bdc1c6]">
        {description || "Meta description preview appears here as you type…"}
      </p>
    </div>
  );
}

export function OgCardPreview({
  title,
  description,
  imageUrl,
  siteName = "ranburg.com",
  className,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  siteName?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-theme-subtle bg-theme-surface/60", className)}>
      <div className="flex aspect-[1.91/1] items-center justify-center bg-gradient-to-br from-accent/20 to-accent-emerald/10 text-xs text-theme-subtle">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          "OG image preview"
        )}
      </div>
      <div className="space-y-1 border-t border-theme-subtle p-3">
        <p className="text-[10px] uppercase tracking-wider text-theme-subtle">{siteName}</p>
        <p className="line-clamp-2 text-sm font-semibold text-theme-heading">{title || "Open Graph title"}</p>
        <p className="line-clamp-2 text-xs text-theme-muted">{description || "Description for social shares…"}</p>
      </div>
    </div>
  );
}
