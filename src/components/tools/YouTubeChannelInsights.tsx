"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import SocialInsightResults, { formatSocialCount, Users, Eye, Video, TrendingUp } from "./SocialInsightResults";
import type { SocialRecommendation } from "@/lib/socialInsights";

interface YouTubeData {
  title: string;
  handle: string | null;
  description: string;
  avatarUrl: string | null;
  subscribers: number;
  hiddenSubscribers: boolean;
  totalViews: number;
  videoCount: number;
  avgViewsPerVideo: number | null;
  recommendations: SocialRecommendation[];
}

export default function YouTubeChannelInsights() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<YouTubeData | null>(null);

  const analyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/youtube/channel?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch channel data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <label className="mb-2 block text-sm font-medium text-theme-body">
          YouTube channel handle, name, or URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="@mkbhd or youtube.com/@channel"
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={analyze}
            disabled={loading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Analyze Channel
          </button>
        </div>
        <p className="mt-2 text-xs text-theme-subtle">
          Uses YouTube Data API for public channel statistics. Private or restricted channels may not be available.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      {data && (
        <SocialInsightResults
          platform="youtube"
          avatarUrl={data.avatarUrl}
          title={data.title}
          subtitle={data.handle ? `youtube.com/${data.handle}` : "YouTube Channel"}
          description={data.description}
          stats={[
            {
              label: "Subscribers",
              value: data.hiddenSubscribers ? "Hidden" : formatSocialCount(data.subscribers),
              icon: <Users className="h-4 w-4" />,
            },
            {
              label: "Total Views",
              value: formatSocialCount(data.totalViews),
              icon: <Eye className="h-4 w-4" />,
            },
            {
              label: "Videos",
              value: formatSocialCount(data.videoCount),
              icon: <Video className="h-4 w-4" />,
            },
            {
              label: "Avg Views (last 10)",
              value: data.avgViewsPerVideo ? formatSocialCount(data.avgViewsPerVideo) : "—",
              icon: <TrendingUp className="h-4 w-4" />,
            },
          ]}
          recommendations={data.recommendations}
        />
      )}
    </div>
  );
}
