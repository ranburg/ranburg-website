import { NextResponse } from "next/server";
import {
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
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not fetch profile. The account may be private or unavailable." },
        { status: 404 }
      );
    }

    const html = await res.text();
    const parsed = parseInstagramOgMeta(html);

    if (!parsed || (parsed.followers === 0 && parsed.posts === 0)) {
      return NextResponse.json(
        {
          error:
            "Public stats unavailable. The profile may be private, restricted, or Instagram blocked the request. Try again later.",
        },
        { status: 422 }
      );
    }

    const recommendations = getInstagramRecommendations({
      followers: parsed.followers,
      following: parsed.following,
      posts: parsed.posts,
    });

    return NextResponse.json({
      platform: "instagram",
      username: parsed.username || username,
      displayName: parsed.displayName || username,
      bio: parsed.bio,
      avatarUrl: parsed.avatarUrl || null,
      followers: parsed.followers,
      following: parsed.following,
      posts: parsed.posts,
      profileUrl: `https://www.instagram.com/${parsed.username || username}/`,
      recommendations,
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyze Instagram profile." }, { status: 500 });
  }
}
