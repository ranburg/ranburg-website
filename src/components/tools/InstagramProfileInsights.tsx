"use client";

import { useState } from "react";
import { Search, Loader2, Calendar, BarChart3 } from "lucide-react";
import SocialInsightResults, { formatSocialCount, Users, Eye, TrendingUp } from "./SocialInsightResults";
import type { GrowthDataPoint, RevenueEstimate, SocialRecommendation } from "@/lib/socialInsights";
import { Image as ImageIcon, UserPlus } from "lucide-react";

interface InstagramData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  followers: number;
  following: number;
  posts: number;
  profileUrl: string;
  tier: string;
  followRatio: number;
  postsPerMonth: number;
  engagementRate: number;
  revenue: RevenueEstimate;
  growthSeries: GrowthDataPoint[];
  recommendations: SocialRecommendation[];
}

export default function InstagramProfileInsights() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<InstagramData | null>(null);

  const analyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/instagram/profile?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <label className="mb-2 block text-sm font-medium text-theme-body">
          Instagram username or profile URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="@username or instagram.com/username"
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={analyze}
            disabled={loading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Analyze Profile
          </button>
        </div>
        <p className="mt-2 text-xs text-theme-subtle">
          Fetches public profile stats, sponsorship revenue estimates, and growth projections.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      {data && (
        <SocialInsightResults
          platform="instagram"
          avatarUrl={data.avatarUrl}
          title={data.displayName || data.username}
          subtitle={`@${data.username}`}
          description={data.bio}
          stats={[
            {
              label: "Followers",
              value: formatSocialCount(data.followers),
              icon: <Users className="h-4 w-4" />,
            },
            {
              label: "Following",
              value: formatSocialCount(data.following),
              icon: <UserPlus className="h-4 w-4" />,
            },
            {
              label: "Posts",
              value: formatSocialCount(data.posts),
              icon: <ImageIcon className="h-4 w-4" />,
            },
            {
              label: "Follow Ratio",
              value: data.following > 0 ? data.followRatio.toFixed(2) : "—",
              icon: <TrendingUp className="h-4 w-4" />,
            },
          ]}
          extraStats={[
            {
              label: "Creator Tier",
              value: data.tier.charAt(0).toUpperCase() + data.tier.slice(1),
              icon: <BarChart3 className="h-4 w-4" />,
            },
            {
              label: "Posts / Month",
              value: data.postsPerMonth.toFixed(1),
              icon: <Calendar className="h-4 w-4" />,
            },
            {
              label: "Est. Engagement",
              value: `${data.engagementRate}%`,
              icon: <Eye className="h-4 w-4" />,
            },
          ]}
          revenue={data.revenue}
          growthSeries={data.growthSeries}
          recommendations={data.recommendations}
        />
      )}
    </div>
  );
}
