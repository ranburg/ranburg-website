import { NextResponse } from "next/server";
import {
  buildYouTubeGrowthSeries,
  estimateYouTubeRevenue,
  getChannelAgeMonths,
  getYouTubeMonetizationStatus,
  getYouTubeRecommendations,
  normalizeYouTubeQuery,
  type RecentVideoStats,
} from "@/lib/socialInsights";

interface YtChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    country?: string;
    thumbnails: { high?: { url: string }; medium?: { url: string } };
  };
  statistics: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
    hiddenSubscriberCount?: boolean;
  };
  contentDetails?: { relatedPlaylists?: { uploads?: string } };
}

async function ytFetch(path: string, apiKey: string) {
  const url = `https://www.googleapis.com/youtube/v3/${path}${path.includes("?") ? "&" : "?"}key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

async function resolveChannel(query: string, apiKey: string): Promise<YtChannel | null> {
  const isChannelId = /^UC[\w-]{22}$/.test(query);

  if (isChannelId) {
    const data = await ytFetch(
      `channels?part=snippet,statistics,contentDetails&id=${query}`,
      apiKey
    );
    return data?.items?.[0] ?? null;
  }

  const byHandle = await ytFetch(
    `channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(query)}`,
    apiKey
  );
  if (byHandle?.items?.[0]) return byHandle.items[0];

  const search = await ytFetch(
    `search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1`,
    apiKey
  );
  const channelId = search?.items?.[0]?.snippet?.channelId ?? search?.items?.[0]?.id?.channelId;
  if (!channelId) return null;

  const data = await ytFetch(
    `channels?part=snippet,statistics,contentDetails&id=${channelId}`,
    apiKey
  );
  return data?.items?.[0] ?? null;
}

async function getRecentVideos(
  uploadsPlaylistId: string,
  apiKey: string
): Promise<{ avgViews: number | undefined; videos: RecentVideoStats[]; totalLikes: number; totalComments: number }> {
  const playlist = await ytFetch(
    `playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=10`,
    apiKey
  );
  const items = playlist?.items ?? [];
  const videoIds = items
    .map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId)
    .filter(Boolean);
  if (!videoIds?.length) {
    return { avgViews: undefined, videos: [], totalLikes: 0, totalComments: 0 };
  }

  const videosData = await ytFetch(
    `videos?part=statistics,snippet&id=${videoIds.join(",")}`,
    apiKey
  );
  const videoItems = videosData?.items ?? [];

  const videos: RecentVideoStats[] = videoItems.map(
    (v: {
      id: string;
      snippet: { title: string; publishedAt: string };
      statistics: { viewCount: string; likeCount?: string; commentCount?: string };
    }) => ({
      title: v.snippet.title,
      videoId: v.id,
      publishedAt: v.snippet.publishedAt,
      views: parseInt(v.statistics.viewCount, 10) || 0,
      likes: parseInt(v.statistics.likeCount ?? "0", 10) || 0,
      comments: parseInt(v.statistics.commentCount ?? "0", 10) || 0,
    })
  );

  const views = videos.map((v) => v.views);
  const avgViews = views.length
    ? Math.round(views.reduce((a, b) => a + b, 0) / views.length)
    : undefined;
  const totalLikes = videos.reduce((a, v) => a + v.likes, 0);
  const totalComments = videos.reduce((a, v) => a + v.comments, 0);

  return { avgViews, videos, totalLikes, totalComments };
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json({ error: "Enter a YouTube channel handle, name, or URL." }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API is not configured. Add YOUTUBE_API_KEY to environment variables." },
      { status: 503 }
    );
  }

  const normalized = normalizeYouTubeQuery(q);
  const channel = await resolveChannel(normalized, apiKey);

  if (!channel) {
    return NextResponse.json({ error: "Channel not found. Try the exact @handle or channel URL." }, { status: 404 });
  }

  const subscribers = parseInt(channel.statistics.subscriberCount, 10) || 0;
  const totalViews = parseInt(channel.statistics.viewCount, 10) || 0;
  const videoCount = parseInt(channel.statistics.videoCount, 10) || 0;
  const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads;

  let avgViewsPerVideo: number | undefined;
  let recentVideos: RecentVideoStats[] = [];
  let totalLikes = 0;
  let totalComments = 0;

  if (uploadsId) {
    const recent = await getRecentVideos(uploadsId, apiKey);
    avgViewsPerVideo = recent.avgViews;
    recentVideos = recent.videos;
    totalLikes = recent.totalLikes;
    totalComments = recent.totalComments;
  }

  const channelAgeMonths = getChannelAgeMonths(channel.snippet.publishedAt);
  const uploadsPerMonth = videoCount > 0 ? videoCount / channelAgeMonths : 0;
  const viewsPerSub = subscribers > 0 ? totalViews / subscribers : 0;
  const engagementRate =
    avgViewsPerVideo && subscribers > 0
      ? Math.round((avgViewsPerVideo / subscribers) * 10000) / 100
      : null;

  const monetization = getYouTubeMonetizationStatus({ subscribers, totalViews, videoCount });
  const revenue = estimateYouTubeRevenue({
    subscribers,
    totalViews,
    videoCount,
    avgViewsPerVideo,
    uploadsPerMonth,
    monetizationStatus: monetization.status,
  });

  const growthSeries = buildYouTubeGrowthSeries({
    subscribers,
    totalViews,
    publishedAt: channel.snippet.publishedAt,
  });

  const recommendations = getYouTubeRecommendations({
    subscribers,
    totalViews,
    videoCount,
    avgViewsPerVideo,
  });

  return NextResponse.json({
    platform: "youtube",
    channelId: channel.id,
    title: channel.snippet.title,
    handle: channel.snippet.customUrl ?? null,
    description: channel.snippet.description.slice(0, 300),
    avatarUrl:
      channel.snippet.thumbnails.high?.url ?? channel.snippet.thumbnails.medium?.url ?? null,
    publishedAt: channel.snippet.publishedAt,
    country: channel.snippet.country ?? null,
    subscribers,
    hiddenSubscribers: channel.statistics.hiddenSubscriberCount ?? false,
    totalViews,
    videoCount,
    avgViewsPerVideo: avgViewsPerVideo ?? null,
    channelAgeMonths,
    uploadsPerMonth: Math.round(uploadsPerMonth * 10) / 10,
    viewsPerSub: Math.round(viewsPerSub * 10) / 10,
    engagementRate,
    totalLikes,
    totalComments,
    recentVideos,
    monetization,
    revenue,
    growthSeries,
    recommendations,
  });
}
