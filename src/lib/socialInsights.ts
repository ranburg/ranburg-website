export type CreatorTier = "nano" | "micro" | "mid" | "macro" | "mega";

export type MonetizationStatus = "not_monetized" | "eligible" | "likely_monetized";

export interface RevenueEstimate {
  monthlyLowUsd: number;
  monthlyMidUsd: number;
  monthlyHighUsd: number;
  annualMidUsd: number;
  rpmLow: number;
  rpmHigh: number;
  estimatedMonthlyViews?: number;
  sponsorshipMidUsd?: number;
  disclaimer: string;
}

export interface GrowthDataPoint {
  label: string;
  primary: number;
  secondary?: number;
}

export interface RecentVideoStats {
  title: string;
  videoId: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
}

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

export function getChannelAgeMonths(publishedAt: string): number {
  const created = new Date(publishedAt).getTime();
  const now = Date.now();
  return Math.max(1, Math.round((now - created) / (1000 * 60 * 60 * 24 * 30.44)));
}

export function getYouTubeMonetizationStatus(stats: {
  subscribers: number;
  totalViews: number;
  videoCount: number;
}): { status: MonetizationStatus; message: string } {
  if (stats.subscribers < 1000) {
    return {
      status: "not_monetized",
      message: `Not monetized yet — ${formatSocialCount(stats.subscribers)} of 1,000 subscribers required for YouTube Partner Program.`,
    };
  }

  const estimatedWatchHours = stats.totalViews > 0 ? (stats.totalViews * 3) / 60 / 12 : 0;
  const meetsWatchHours = estimatedWatchHours >= 4000;

  if (stats.subscribers >= 1000 && (meetsWatchHours || stats.totalViews >= 5_000_000)) {
    if (stats.subscribers >= 10_000 && stats.videoCount >= 20) {
      return {
        status: "likely_monetized",
        message: "Likely monetized — channel meets subscriber thresholds and has substantial view history.",
      };
    }
    return {
      status: "eligible",
      message: "Eligible for YouTube Partner Program — verify 4,000 watch hours or Shorts views threshold in YouTube Studio.",
    };
  }

  return {
    status: "eligible",
    message: "1,000+ subscribers reached. Complete watch hours or Shorts views requirement to enable monetization.",
  };
}

export function estimateYouTubeRevenue(stats: {
  subscribers: number;
  totalViews: number;
  videoCount: number;
  avgViewsPerVideo?: number;
  uploadsPerMonth?: number;
  monetizationStatus: MonetizationStatus;
}): RevenueEstimate | null {
  const viewsPerVideo =
    stats.avgViewsPerVideo ?? (stats.videoCount > 0 ? stats.totalViews / stats.videoCount : 0);
  const uploadsPerMonth =
    stats.uploadsPerMonth ?? (stats.videoCount > 0 ? Math.max(0.5, stats.videoCount / 24) : 1);
  const estimatedMonthlyViews = Math.round(viewsPerVideo * uploadsPerMonth);

  const tier = getCreatorTier(stats.subscribers);
  const rpmByTier: Record<CreatorTier, [number, number]> = {
    nano: [0.5, 2],
    micro: [1, 4],
    mid: [2, 8],
    macro: [3, 12],
    mega: [4, 18],
  };
  const [rpmLow, rpmHigh] = rpmByTier[tier];

  if (stats.monetizationStatus === "not_monetized") {
    return {
      monthlyLowUsd: 0,
      monthlyMidUsd: 0,
      monthlyHighUsd: 0,
      annualMidUsd: 0,
      rpmLow,
      rpmHigh,
      estimatedMonthlyViews,
      disclaimer:
        "Channel is not monetized yet. Figures below show potential ad revenue if YPP requirements are met.",
    };
  }

  const monthlyLowUsd = (estimatedMonthlyViews / 1000) * rpmLow;
  const monthlyHighUsd = (estimatedMonthlyViews / 1000) * rpmHigh;
  const monthlyMidUsd = (monthlyLowUsd + monthlyHighUsd) / 2;

  return {
    monthlyLowUsd: Math.round(monthlyLowUsd * 100) / 100,
    monthlyMidUsd: Math.round(monthlyMidUsd * 100) / 100,
    monthlyHighUsd: Math.round(monthlyHighUsd * 100) / 100,
    annualMidUsd: Math.round(monthlyMidUsd * 12 * 100) / 100,
    rpmLow,
    rpmHigh,
    estimatedMonthlyViews,
    disclaimer:
      "Estimates use typical RPM ranges by channel size. Actual earnings vary by niche, geography, seasonality, and ad fill rate.",
  };
}

export function estimateInstagramRevenue(stats: {
  followers: number;
  posts: number;
  engagementRate?: number;
}): RevenueEstimate {
  const tier = getCreatorTier(stats.followers);
  const engagement = stats.engagementRate ?? (tier === "mega" ? 1.5 : tier === "macro" ? 2 : 3);

  const sponsoredPostRates: Record<CreatorTier, [number, number]> = {
    nano: [10, 50],
    micro: [50, 500],
    mid: [500, 5000],
    macro: [5000, 25000],
    mega: [25000, 100000],
  };
  const [postLow, postHigh] = sponsoredPostRates[tier];
  const postsPerMonth = Math.max(1, Math.min(8, stats.posts / 12));
  const sponsorshipLow = postLow * postsPerMonth * 0.3;
  const sponsorshipHigh = postHigh * postsPerMonth * 0.3;
  const sponsorshipMid = (sponsorshipLow + sponsorshipHigh) / 2;

  const affiliateLow = stats.followers * 0.001;
  const affiliateHigh = stats.followers * 0.008;
  const affiliateMid = (affiliateLow + affiliateHigh) / 2;

  const monthlyLowUsd = sponsorshipLow + affiliateLow;
  const monthlyHighUsd = sponsorshipHigh + affiliateHigh;
  const monthlyMidUsd = sponsorshipMid + affiliateMid;

  return {
    monthlyLowUsd: Math.round(monthlyLowUsd),
    monthlyMidUsd: Math.round(monthlyMidUsd),
    monthlyHighUsd: Math.round(monthlyHighUsd),
    annualMidUsd: Math.round(monthlyMidUsd * 12),
    rpmLow: 0,
    rpmHigh: 0,
    sponsorshipMidUsd: Math.round(sponsorshipMid),
    disclaimer: `Estimates assume ~${engagement.toFixed(1)}% engagement and ${postsPerMonth.toFixed(1)} brand deals/month. Instagram has no direct ad-revenue share like YouTube.`,
  };
}

export function buildYouTubeGrowthSeries(stats: {
  subscribers: number;
  totalViews: number;
  publishedAt: string;
}): GrowthDataPoint[] {
  const ageMonths = getChannelAgeMonths(stats.publishedAt);
  const months = Math.min(12, ageMonths);
  const subGrowthRate = stats.subscribers / ageMonths;
  const viewGrowthRate = stats.totalViews / ageMonths;
  const points: GrowthDataPoint[] = [];

  for (let i = months; i >= 0; i--) {
    const label = i === 0 ? "Now" : `-${i}mo`;
    const factor = Math.max(0, 1 - i / Math.max(ageMonths, 1));
    points.push({
      label,
      primary: Math.round(stats.subscribers * factor),
      secondary: Math.round(stats.totalViews * factor),
    });
  }

  for (let i = 1; i <= 6; i++) {
    points.push({
      label: `+${i}mo`,
      primary: Math.round(stats.subscribers + subGrowthRate * i * 1.05),
      secondary: Math.round(stats.totalViews + viewGrowthRate * i * 1.08),
    });
  }

  return points;
}

export function buildInstagramGrowthSeries(stats: {
  followers: number;
  posts: number;
}): GrowthDataPoint[] {
  const assumedAgeMonths = Math.max(12, Math.round(stats.posts / 2));
  const followerGrowth = stats.followers / assumedAgeMonths;
  const postGrowth = stats.posts / assumedAgeMonths;
  const points: GrowthDataPoint[] = [];

  for (let i = 12; i >= 0; i--) {
    const factor = Math.max(0, 1 - i / assumedAgeMonths);
    points.push({
      label: i === 0 ? "Now" : `-${i}mo`,
      primary: Math.round(stats.followers * factor),
      secondary: Math.round(stats.posts * factor),
    });
  }

  for (let i = 1; i <= 6; i++) {
    points.push({
      label: `+${i}mo`,
      primary: Math.round(stats.followers + followerGrowth * i * 1.06),
      secondary: Math.round(stats.posts + postGrowth * i),
    });
  }

  return points;
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
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

export interface InstagramProfileData {
  displayName: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  avatarUrl: string;
  isPrivate: boolean;
}

export function parseInstagramWebProfile(json: unknown, fallbackUsername: string): InstagramProfileData | null {
  const root = json as { status?: string; data?: { user?: Record<string, unknown> } };
  if (root.status === "fail") return null;

  const user = root.data?.user;
  if (!user) return null;

  const isPrivate = Boolean(user.is_private);
  const followers =
    (user.edge_followed_by as { count?: number })?.count ??
    (user.follower_count as number) ??
    0;
  const following =
    (user.edge_follow as { count?: number })?.count ??
    (user.following_count as number) ??
    0;
  const posts =
    (user.edge_owner_to_timeline_media as { count?: number })?.count ??
    (user.media_count as number) ??
    0;

  return {
    displayName: (user.full_name as string) || fallbackUsername,
    username: (user.username as string) || fallbackUsername,
    bio: (user.biography as string) || "",
    followers,
    following,
    posts,
    avatarUrl:
      (user.profile_pic_url_hd as string) || (user.profile_pic_url as string) || "",
    isPrivate,
  };
}

function extractUserFromJsonNode(node: unknown, fallbackUsername: string): InstagramProfileData | null {
  if (!node || typeof node !== "object") return null;
  const obj = node as Record<string, unknown>;

  const followedBy = obj.edge_followed_by as { count?: number } | undefined;
  const follow = obj.edge_follow as { count?: number } | undefined;
  if (followedBy?.count != null || follow?.count != null) {
    const media = obj.edge_owner_to_timeline_media as { count?: number } | undefined;
    return {
      displayName: (obj.full_name as string) || fallbackUsername,
      username: (obj.username as string) || fallbackUsername,
      bio: (obj.biography as string) || "",
      followers: followedBy?.count ?? 0,
      following: follow?.count ?? 0,
      posts: media?.count ?? 0,
      avatarUrl:
        (obj.profile_pic_url_hd as string) || (obj.profile_pic_url as string) || "",
      isPrivate: Boolean(obj.is_private),
    };
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = extractUserFromJsonNode(item, fallbackUsername);
      if (found) return found;
    }
    return null;
  }

  for (const value of Object.values(obj)) {
    const found = extractUserFromJsonNode(value, fallbackUsername);
    if (found) return found;
  }
  return null;
}

export function parseInstagramEmbeddedJson(
  html: string,
  fallbackUsername: string
): InstagramProfileData | null {
  const scripts = html.matchAll(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    try {
      const data = JSON.parse(match[1]);
      const user = extractUserFromJsonNode(data, fallbackUsername);
      if (user && (user.followers > 0 || user.posts > 0)) return user;
    } catch {
      /* skip invalid JSON blocks */
    }
  }

  const legacy = html.match(/"edge_followed_by":\{"count":(\d+)\}/);
  if (legacy) {
    const followingJson = html.match(/"edge_follow":\{"count":(\d+)\}/);
    const mediaJson = html.match(/"edge_owner_to_timeline_media":\{"count":(\d+)/);
    const usernameMatch = html.match(/"username":"([^"]+)"/);
    const fullNameMatch = html.match(/"full_name":"([^"]*)"/);
    return {
      displayName: fullNameMatch?.[1] || fallbackUsername,
      username: usernameMatch?.[1] || fallbackUsername,
      bio: "",
      followers: parseInt(legacy[1], 10),
      following: followingJson ? parseInt(followingJson[1], 10) : 0,
      posts: mediaJson ? parseInt(mediaJson[1], 10) : 0,
      avatarUrl: "",
      isPrivate: false,
    };
  }

  return null;
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
