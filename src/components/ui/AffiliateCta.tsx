"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

/**
 * Optional affiliate CTA — only renders when NEXT_PUBLIC_AFFILIATE_ENABLED=true.
 * Wire partner URLs via env later; keeps pages clean until AdSense is stable.
 */
export default function AffiliateCta({
  context,
}: {
  context: "privacy" | "developer" | "creator";
}) {
  if (process.env.NEXT_PUBLIC_AFFILIATE_ENABLED !== "true") return null;

  const copy =
    context === "privacy"
      ? {
          title: "Protect privacy on the go",
          body: "Pair EXIF cleanup with a trusted VPN when you travel or use public Wi‑Fi.",
          href: process.env.NEXT_PUBLIC_AFFILIATE_VPN_URL || "/tools",
          cta: "See options",
        }
      : context === "creator"
        ? {
            title: "Level up your creator stack",
            body: "After you estimate earnings, explore tools that help with thumbnails and scheduling.",
            href: process.env.NEXT_PUBLIC_AFFILIATE_CREATOR_URL || "/tools/social-media",
            cta: "Explore",
          }
        : {
            title: "Ship faster on solid hosting",
            body: "Building your own tools or sites? Start with reliable developer hosting.",
            href: process.env.NEXT_PUBLIC_AFFILIATE_HOSTING_URL || "/tools/developer",
            cta: "Learn more",
          };

  return (
    <aside className="mt-8 rounded-xl border border-theme-subtle bg-theme-surface/40 p-5">
      <p className="text-sm font-semibold text-theme-heading">{copy.title}</p>
      <p className="mt-1 text-sm text-theme-muted">{copy.body}</p>
      <Link
        href={copy.href}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        rel="noopener sponsored"
      >
        {copy.cta}
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </aside>
  );
}
