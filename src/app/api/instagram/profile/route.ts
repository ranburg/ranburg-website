import { NextResponse } from "next/server";
import {
  buildInstagramGrowthSeries,
  estimateInstagramRevenue,
  fetchInstagramHtmlProfile,
  fetchInstagramWebProfile,
  getCreatorTier,
  getInstagramRecommendations,
  normalizeInstagramUsername,
  parseInstagramOgMeta,
} from "@/lib/socialInsights";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json({ error: "Enter an Instagram username or profile URL." }, { status: 400 });
  }

  const username = normalizeInstagramUsername(q);
  if (!username || username.length > 30) {
    return NextResponse.json({ error: "Invalid Instagram username." }, { status: 400 });
  }

  try {
    let profile = await fetchInstagramWebProfile(username);

    if (!profile) {
      const html = await fetchInstagramHtmlProfile(username);
      if (html) {
        const parsed = parseInstagramOgMeta(html);
        if (parsed) {
          profile = {
            displayName: parsed.displayName || username,
            username: parsed.username || username,
            bio: parsed.bio,
            followers: parsed.followers,
            following: parsed.following,
            posts: parsed.posts,
            avatarUrl: parsed.avatarUrl,
            isPrivate: false,
          };
        }
      }
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Could not fetch profile. The account may be private or unavailable." },
        { status: 404 }
      );
    }

    if (profile.isPrivate) {
      return NextResponse.json(
        { error: "This is a private account. Only public profiles can be analyzed." },
        { status: 403 }
      );
    }

    if (profile.followers === 0 && profile.posts === 0) {
      return NextResponse.json(
        {
          error:
            "Public stats unavailable. Instagram may have temporarily blocked the request — try again in a few minutes.",
        },
        { status: 422 }
      );
    }

    const recommendations = getInstagramRecommendations({
      followers: profile.followers,
      following: profile.following,
      posts: profile.posts,
    });

    const tier = getCreatorTier(profile.followers);
    const followRatio =
      profile.following > 0
        ? Math.round((profile.followers / profile.following) * 100) / 100
        : profile.followers;
    const postsPerMonth = profile.posts > 0 ? Math.max(0.5, profile.posts / 24) : 1;
    const engagementRate = tier === "mega" ? 1.5 : tier === "macro" ? 2 : tier === "mid" ? 3 : 4;

    const revenue = estimateInstagramRevenue({
      followers: profile.followers,
      posts: profile.posts,
      engagementRate,
    });

    const growthSeries = buildInstagramGrowthSeries({
      followers: profile.followers,
      posts: profile.posts,
    });

    return NextResponse.json({
      platform: "instagram",
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl || null,
      followers: profile.followers,
      following: profile.following,
      posts: profile.posts,
      profileUrl: `https://www.instagram.com/${profile.username}/`,
      tier,
      followRatio,
      postsPerMonth: Math.round(postsPerMonth * 10) / 10,
      engagementRate,
      revenue,
      growthSeries,
      recommendations,
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyze Instagram profile." }, { status: 500 });
  }
}
