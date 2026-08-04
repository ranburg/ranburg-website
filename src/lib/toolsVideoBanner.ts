/** Homepage explainer banner scenes + optional real video path. */

/** Drop a real MP4 here after generation: public/videos/ranburg-tools-explainer.mp4 */
export const TOOLS_EXPLAINER_VIDEO_SRC = "/videos/ranburg-tools-explainer.mp4";

export const TOOLS_EXPLAINER_SCENES = [
  {
    id: "emi",
    eyebrow: "Finance",
    title: "EMI in 10 seconds",
    detail: "₹25L · 8.5% · 20 yrs → monthly installment instantly",
    href: "/tools/emi",
    cta: "Open EMI calculator",
    accent: "from-amber-500 to-orange-500",
    metric: "₹21,673",
    metricLabel: "Monthly EMI",
  },
  {
    id: "sip",
    eyebrow: "Wealth",
    title: "See your SIP corpus grow",
    detail: "₹10k/month · 12% · 15 years — invested vs returns side by side",
    href: "/tools/sip",
    cta: "Open SIP calculator",
    accent: "from-teal-500 to-cyan-500",
    metric: "₹50L+",
    metricLabel: "Projected corpus",
  },
  {
    id: "gst",
    eyebrow: "India tax",
    title: "GST inclusive or exclusive",
    detail: "5% · 12% · 18% · 28% with CGST/SGST or IGST split",
    href: "/tools/gst-calculator",
    cta: "Open GST calculator",
    accent: "from-indigo-600 to-violet-600",
    metric: "18%",
    metricLabel: "Most common slab",
  },
  {
    id: "youtube",
    eyebrow: "Creators",
    title: "Estimate YouTube earnings",
    detail: "Views × RPM + sponsorships — free revenue ranges",
    href: "/tools/youtube-revenue-calculator",
    cta: "Open YT revenue tool",
    accent: "from-red-600 to-red-500",
    metric: "$2.50",
    metricLabel: "Sample RPM",
  },
  {
    id: "toolkit",
    eyebrow: "Ranburg",
    title: "81+ free tools. No signup.",
    detail: "Finance, creators, PDF, image & developer utilities in one place",
    href: "/tools",
    cta: "Browse all tools",
    accent: "from-teal-600 to-emerald-500",
    metric: "Free",
    metricLabel: "Forever",
  },
] as const;

export type ToolsExplainerScene = (typeof TOOLS_EXPLAINER_SCENES)[number];
