import Link from "next/link";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { ArrowRight, BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";

const PLATFORMS = [
  {
    platform: "YouTube",
    gradient: "from-red-600 to-red-500",
    glow: "bg-red-500/20",
    border: "border-red-500/25 hover:border-red-500/50",
    analytics: "youtube-channel-insights",
    revenue: "youtube-revenue-calculator",
    features: ["Subscriber & view stats", "Monetization status", "Revenue estimates", "Growth charts"],
  },
  {
    platform: "Instagram",
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    glow: "bg-rose-500/20",
    border: "border-rose-500/25 hover:border-rose-500/50",
    analytics: "instagram-profile-insights",
    revenue: "instagram-revenue-calculator",
    features: ["Follower & post counts", "Sponsorship estimates", "Engagement insights", "Growth projections"],
  },
] as const;

export default function SocialToolsSpotlight() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Our Flagship Tools
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-theme-heading sm:text-4xl lg:text-5xl">
            YouTube & Instagram{" "}
            <span className="text-gradient-accent">Analytics & Revenue</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-theme-muted">
            Analyze any public channel or profile, check monetization potential, and get growth
            recommendations — completely free, no login required.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {PLATFORMS.map((p) => {
            const analytics = getToolBySlug(p.analytics);
            const revenue = getToolBySlug(p.revenue);
            if (!analytics || !revenue) return null;

            const AnalyticsIcon = getToolIcon(analytics.icon);

            return (
              <div
                key={p.platform}
                className={`relative overflow-hidden rounded-2xl border bg-theme-surface/40 p-6 sm:p-8 transition-colors ${p.border}`}
              >
                <div className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full ${p.glow} blur-3xl`} />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient}`}>
                      <AnalyticsIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-theme-heading">{p.platform}</h3>
                      <p className="text-sm text-theme-muted">Analytics + revenue tools</p>
                    </div>
                  </div>

                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-theme-muted">
                        <TrendingUp className="h-3.5 w-3.5 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 space-y-3">
                    <Link
                      href={`/tools/${analytics.slug}`}
                      className={`group flex items-center gap-4 rounded-xl border border-theme-subtle bg-theme-bg/60 p-4 transition-all hover:border-accent/30 hover:shadow-md`}
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${analytics.gradient}`}>
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-theme-heading group-hover:text-accent">
                          {analytics.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-sm text-theme-muted">
                          {analytics.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-theme-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>

                    <Link
                      href={`/tools/${revenue.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-theme-subtle bg-theme-bg/60 p-4 transition-all hover:border-accent/30 hover:shadow-md"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${revenue.gradient}`}>
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-theme-heading group-hover:text-accent">
                          {revenue.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-sm text-theme-muted">
                          {revenue.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-theme-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>
                  </div>

                  <Link
                    href={`/tools/${analytics.slug}`}
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${p.gradient} px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto`}
                  >
                    <Users className="h-4 w-4" />
                    Analyze {p.platform} Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
