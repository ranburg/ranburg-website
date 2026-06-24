import type { NextConfig } from "next";
import { TOOL_SLUG_REDIRECTS } from "./src/lib/salesforceToolsHub";
import { getCategoryAliasRedirects } from "./src/lib/categoryAliases";

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
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/services/salesforce-development",
        destination: "/tools/salesforce",
        permanent: true,
      },
      ...toolRedirects,
      ...getCategoryAliasRedirects(),
    ];
  },
};

export default nextConfig;
