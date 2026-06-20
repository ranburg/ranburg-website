export type CreatorTier = "nano" | "micro" | "mid" | "macro" | "mega";

export interface SocialRecommendation {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export function parseCountToken(raw: string): number {
  const s = raw.replace(/,/g, "").trim().toUpperCase();
  const num = parseFloat(s);
  if (isNaN(num)) return 0;
  if (s.endsWith("K")) return Math.round(num * 1_000);
  if (s.endsWith("M")) return Math.round(num * 1_000_000);
  if (s.endsWith("B")) return Math.round(num * 1_000_000_000);
  return Math.round(num);
}

export function getCreatorTier(count: number): CreatorTier {
  if (count < 1_000) return "nano";
  if (count < 10_000) return "micro";
  if (count < 100_000) return "mid";
  if (count < 1_000_000) return "macro";
  return "mega";
}

export function formatSocialCount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function normalizeYouTubeQuery(input: string): string {
  let q = input.trim();
  try {
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      const url = new URL(q.startsWith("http") ? q : `https://${q}`);
      const path = url.pathname;
      const handle = path.match(/^\/@([^/]+)/)?.[1];
      if (handle) return handle;
      const channelId = path.match(/^\/channel\/([^/]+)/)?.[1];
      if (channelId) return channelId;
      const custom = path.match(/^\/c\/([^/]+)/)?.[1];
      if (custom) return custom;
      const user = path.match(/^\/user\/([^/]+)/)?.[1];
      if (user) return user;
    }
  } catch {
    /* not a URL */
  }
  return q.replace(/^@/, "");
}

export function normalizeInstagramUsername(input: string): string {
  let q = input.trim().replace(/^@/, "");
  const match = q.match(/instagram\.com\/([^/?#]+)/i);
  if (match) q = match[1];
  return q.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
}

export function getYouTubeRecommendations(stats: {
  subscribers: number;
  totalViews: number;
  videoCount: number;
  avgViewsPerVideo?: number;
}): SocialRecommendation[] {
  const tips: SocialRecommendation[] = [];
  const tier = getCreatorTier(stats.subscribers);
  const viewsPerVideo =
    stats.avgViewsPerVideo ??
    (stats.videoCount > 0 ? stats.totalViews / stats.videoCount : 0);
  const subViewRatio = stats.subscribers > 0 ? viewsPerVideo / stats.subscribers : 0;

  tips.push({
    title: "Audience size",
    detail: `This channel is in the ${tier} tier (${formatSocialCount(stats.subscribers)} subscribers). ${
      tier === "nano"
        ? "Focus on niche topics and consistent weekly uploads to reach 1K subscribers."
        : tier === "micro"
          ? "Optimize thumbnails and titles — CTR improvements compound quickly at this stage."
          : tier === "mid"
            ? "Double down on series content and community posts to retain subscribers."
            : "Leverage Shorts and collaborations to expand reach beyond your core audience."
    }`,
    priority: "high",
  });

  if (stats.videoCount < 10) {
    tips.push({
      title: "Content library",
      detail: `Only ${stats.videoCount} videos published. Aim for 20+ indexed videos so YouTube can understand your niche and recommend you in browse features.`,
      priority: "high",
    });
  } else if (stats.videoCount < 50) {
    tips.push({
      title: "Publishing cadence",
      detail: "Maintain 1–2 uploads per week. Channels with 50+ videos see stronger session time and suggested traffic.",
      priority: "medium",
    });
  }

  if (subViewRatio < 0.05 && stats.subscribers > 1000) {
    tips.push({
      title: "Subscriber engagement",
      detail: "Average views per video are low relative to subscriber count. Refresh hooks in the first 30 seconds and test shorter video lengths.",
      priority: "high",
    });
  } else if (subViewRatio > 0.3) {
    tips.push({
      title: "Strong engagement signal",
      detail: "Views per video are healthy vs subscriber base. Consider playlists, end screens, and community tab polls to deepen loyalty.",
      priority: "medium",
    });
  }

  tips.push({
    title: "SEO & discoverability",
    detail: "Use keyword-rich titles, custom thumbnails with readable text, and chapters. Add 150+ word descriptions with timestamps and links.",
    priority: "medium",
  });

  tips.push({
    title: "Monetization readiness",
    detail:
      stats.subscribers >= 1000 && stats.totalViews >= 10_000_000
        ? "You may qualify for YouTube Partner Program. Review watch hours and policy compliance in YouTube Studio."
        : "Grow toward 1,000 subscribers and 4,000 watch hours (or Shorts views threshold) for monetization eligibility.",
    priority: "low",
  });

  return tips;
}

export function getInstagramRecommendations(stats: {
  followers: number;
  following: number;
  posts: number;
}): SocialRecommendation[] {
  const tips: SocialRecommendation[] = [];
  const tier = getCreatorTier(stats.followers);
  const followRatio = stats.followers / Math.max(stats.following, 1);
  const postsPer1k = stats.followers > 0 ? (stats.posts / stats.followers) * 1000 : 0;

  tips.push({
    title: "Profile tier",
    detail: `This profile is ${tier}-tier with ${formatSocialCount(stats.followers)} followers. ${
      tier === "nano"
        ? "Post Reels 3–4× weekly and use 3–5 niche hashtags to accelerate discovery."
        : tier === "micro"
          ? "Shift to educational carousels and save-worthy Reels to boost shares."
          : tier === "mid"
            ? "Collaborate with adjacent creators and pin your best-performing Reel."
            : "Focus on brand partnerships, UGC-style content, and Instagram Shop if applicable."
    }`,
    priority: "high",
  });

  if (stats.posts < 12) {
    tips.push({
      title: "Content volume",
      detail: `Only ${stats.posts} posts on the grid. Aim for 30+ quality posts so new visitors see a cohesive brand story.`,
      priority: "high",
    });
  }

  if (followRatio < 0.5 && stats.following > 500) {
    tips.push({
      title: "Follow ratio",
      detail: "Following count is high relative to followers. Unfollow inactive accounts and engage organically instead of mass-following.",
      priority: "medium",
    });
  } else if (followRatio > 2) {
    tips.push({
      title: "Healthy authority signal",
      detail: "Strong follower-to-following ratio suggests organic growth. Maintain reply engagement in comments and DMs.",
      priority: "low",
    });
  }

  if (postsPer1k < 0.5 && stats.followers > 1000) {
    tips.push({
      title: "Posting frequency",
      detail: "Posting cadence appears low for your audience size. Target 3–5 Reels and 2 carousels per week for algorithm favor.",
      priority: "high",
    });
  }

  tips.push({
    title: "Bio & conversion",
    detail: "Use a clear bio line, one link-in-bio destination, and highlight stories for offers or lead magnets. Add keywords in name field for search.",
    priority: "medium",
  });

  tips.push({
    title: "Best posting times",
    detail: "Check Instagram Insights for when your followers are online. Generally Tue–Thu 9–11 AM and 7–9 PM in your audience timezone perform well.",
    priority: "low",
  });

  return tips;
}

export function parseInstagramOgMeta(html: string): {
  displayName: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  avatarUrl: string;
} | null {
  const getMeta = (prop: string) =>
    html.match(new RegExp(`property="${prop}" content="([^"]*)"`, "i"))?.[1] ??
    html.match(new RegExp(`content="([^"]*)" property="${prop}"`, "i"))?.[1];

  const ogDesc = getMeta("og:description") ?? "";
  const ogTitle = getMeta("og:title") ?? "";
  const ogImage = getMeta("og:image") ?? "";

  const followersMatch = ogDesc.match(/([\d,.]+[KMBkmb]?)\s+Followers/i);
  const followingMatch = ogDesc.match(/([\d,.]+[KMBkmb]?)\s+Following/i);
  const postsMatch = ogDesc.match(/([\d,.]+[KMBkmb]?)\s+Posts/i);

  if (!followersMatch && !postsMatch) {
    const jsonMatch = html.match(/"edge_followed_by":\{"count":(\d+)\}/);
    const followingJson = html.match(/"edge_follow":\{"count":(\d+)\}/);
    const mediaJson = html.match(/"edge_owner_to_timeline_media":\{"count":(\d+)/);
    if (jsonMatch) {
      return {
        displayName: ogTitle.replace(/ \(@[^)]+\) on Instagram.*$/i, "").trim() || "",
        username: ogTitle.match(/\(@([^)]+)\)/)?.[1] ?? "",
        bio: ogDesc,
        followers: parseInt(jsonMatch[1], 10),
        following: followingJson ? parseInt(followingJson[1], 10) : 0,
        posts: mediaJson ? parseInt(mediaJson[1], 10) : 0,
        avatarUrl: ogImage,
      };
    }
    return null;
  }

  const username = ogTitle.match(/\(@([^)]+)\)/)?.[1] ?? "";
  const displayName = ogTitle.replace(/ \(@[^)]+\) on Instagram.*$/i, "").trim();

  return {
    displayName,
    username,
    bio: ogDesc.split(" - ").slice(1).join(" - ").replace(/^See Instagram.*$/i, "").trim(),
    followers: followersMatch ? parseCountToken(followersMatch[1]) : 0,
    following: followingMatch ? parseCountToken(followingMatch[1]) : 0,
    posts: postsMatch ? parseCountToken(postsMatch[1]) : 0,
    avatarUrl: ogImage,
  };
}
