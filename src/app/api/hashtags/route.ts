import { NextResponse } from "next/server";
import {
  generateHashtags,
  type HashtagMix,
  type HashtagPlatform,
  type HashtagPreset,
} from "@/lib/hashtagGenerator";

const PLATFORMS = new Set(["youtube", "instagram"]);
const MIXES = new Set(["balanced", "broad", "niche", "branded"]);
const PRESETS = new Set(["shorts", "long-form", "reels", "feed"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = (searchParams.get("topic") ?? "").trim();
  const niche = (searchParams.get("niche") ?? "").trim() || undefined;
  const platform = (searchParams.get("platform") ?? "instagram") as HashtagPlatform;
  const mix = (searchParams.get("mix") ?? "balanced") as HashtagMix;
  const presetRaw = searchParams.get("preset");
  const count = Number(searchParams.get("count") ?? "15");

  if (!topic || topic.length < 2) {
    return NextResponse.json({ error: "topic is required (min 2 characters)" }, { status: 400 });
  }
  if (!PLATFORMS.has(platform)) {
    return NextResponse.json({ error: "platform must be youtube or instagram" }, { status: 400 });
  }
  if (!MIXES.has(mix)) {
    return NextResponse.json({ error: "invalid mix" }, { status: 400 });
  }

  let preset: HashtagPreset | undefined;
  if (presetRaw) {
    if (!PRESETS.has(presetRaw)) {
      return NextResponse.json({ error: "invalid preset" }, { status: 400 });
    }
    preset = presetRaw as HashtagPreset;
  }

  const result = await generateHashtags({
    topic,
    niche,
    platform,
    count: Number.isFinite(count) ? count : 15,
    mix,
    preset,
  });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
