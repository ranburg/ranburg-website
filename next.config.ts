import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { TOOL_SLUG_REDIRECTS } from "./src/lib/salesforceToolsHub";
import { getCategoryAliasRedirects } from "./src/lib/categoryAliases";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const locales = ["es", "pt", "hi", "ar", "ja", "ko"] as const;

function withLocaleRedirects(
  redirects: { source: string; destination: string; permanent: boolean }[]
) {
  const out = [...redirects];
  for (const r of redirects) {
    for (const locale of locales) {
      out.push({
        source: `/${locale}${r.source}`,
        destination: `/${locale}${r.destination}`,
        permanent: r.permanent,
      });
    }
  }
  return out;
}

const toolRedirects = Object.entries(TOOL_SLUG_REDIRECTS).map(([source, destination]) => ({
  source: `/tools/${source}`,
  destination: `/tools/${destination}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  serverExternalPackages: ["got-scraping"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return withLocaleRedirects([
      {
        source: "/services/salesforce-development",
        destination: "/tools/salesforce",
        permanent: true,
      },
      ...toolRedirects,
      ...getCategoryAliasRedirects(),
    ]);
  },
};

export default withNextIntl(nextConfig);
