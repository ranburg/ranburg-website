import { NextResponse } from "next/server";
import {
  getYouTubeRecommendations,
  normalizeYouTubeQuery,
} from "@/lib/socialInsights";

interface YtChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
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

async function getAvgViews(uploadsPlaylistId: string, apiKey: string): Promise<number | undefined> {
  const playlist = await ytFetch(
    `playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=10`,
    apiKey
  );
  const videoIds = playlist?.items?.map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId).filter(Boolean);
  if (!videoIds?.length) return undefined;

  const videos = await ytFetch(
    `videos?part=statistics&id=${videoIds.join(",")}`,
    apiKey
  );
  const views = videos?.items?.map((v: { statistics: { viewCount: string } }) => parseInt(v.statistics.viewCount, 10)) ?? [];
  if (!views.length) return undefined;
  return Math.round(views.reduce((a: number, b: number) => a + b, 0) / views.length);
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
  const avgViewsPerVideo = uploadsId ? await getAvgViews(uploadsId, apiKey) : undefined;

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
    subscribers,
    hiddenSubscribers: channel.statistics.hiddenSubscriberCount ?? false,
    totalViews,
    videoCount,
    avgViewsPerVideo: avgViewsPerVideo ?? null,
    recommendations,
  });
}
