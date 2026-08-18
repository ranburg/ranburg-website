"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/siteConfig";

/**
 * Assembles the address after mount so the HTML source has no harvestable mailto.
 * Falls back to the contact page for no-JS users.
 */
export default function EmailLink({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <Link href="/contact" className={className}>
        {children ?? "Contact us"}
      </Link>
    );
  }

  return (
    <a href={`mailto:${SITE.email}`} className={className}>
      {children ?? SITE.email}
    </a>
  );
}
