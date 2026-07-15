export type HashtagPlatform = "youtube" | "instagram";
export type HashtagMix = "balanced" | "broad" | "niche" | "branded";
export type HashtagPreset = "shorts" | "long-form" | "reels" | "feed";

export interface HashtagRequest {
  topic: string;
  niche?: string;
  platform: HashtagPlatform;
  count: number;
  mix: HashtagMix;
  preset?: HashtagPreset;
}

export interface HashtagItem {
  tag: string;
  bucket: "broad" | "niche" | "branded" | "trend";
  source: "datamuse" | "local" | "trend";
}

export interface HashtagResponse {
  hashtags: HashtagItem[];
  joined: string;
  source: "api" | "fallback";
}

const PLATFORM_TRENDS: Record<HashtagPlatform, string[]> = {
  youtube: [
    "youtube",
    "youtuber",
    "youtubeshorts",
    "shorts",
    "subscribe",
    "viral",
    "trending",
    "fyp",
    "creator",
    "contentcreator",
    "newvideo",
    "vlog",
    "howto",
    "tutorial",
    "explainer",
  ],
  instagram: [
    "instagram",
    "instagood",
    "reels",
    "reelsinstagram",
    "explorepage",
    "viral",
    "trending",
    "instadaily",
    "photooftheday",
    "igers",
    "contentcreator",
    "instacreator",
    "fyp",
    "discoverunder10k",
    "growth",
  ],
};

const PRESET_TAGS: Record<HashtagPreset, string[]> = {
  shorts: ["shorts", "youtubeshorts", "shortsvideo", "viralshorts", "shortform"],
  "long-form": ["youtube", "longform", "documentarystyle", "indepth", "fullvideo"],
  reels: ["reels", "reelsinstagram", "reelsindia", "reelitfeelit", "reelsviral"],
  feed: ["instagood", "photooftheday", "igers", "instalike", "picoftheday"],
};

const NICHE_TREND_PACKS: Record<string, string[]> = {
  fitness: ["fitness", "gym", "workout", "fitnessmotivation", "healthylifestyle", "fitfam", "training", "gains"],
  gaming: ["gaming", "gamer", "twitch", "esports", "gameplay", "pcgaming", "streamer", "videogames"],
  tech: ["tech", "technology", "gadgets", "ai", "software", "coding", "innovation", "startup"],
  beauty: ["beauty", "makeup", "skincare", "beautytips", "makeuptutorial", "glowup", "cosmetics"],
  food: ["food", "foodie", "recipe", "cooking", "homemade", "yummy", "foodstagram", "tasty"],
  travel: ["travel", "wanderlust", "travelgram", "adventure", "explore", "vacation", "trip"],
  finance: ["finance", "investing", "money", "personalfinance", "stocks", "wealth", "business"],
  education: ["education", "learning", "study", "student", "knowledge", "onlinelearning", "tips"],
  fashion: ["fashion", "style", "ootd", "streetstyle", "outfit", "fashionblogger"],
  music: ["music", "musician", "newmusic", "songwriter", "beats", "indieartist"],
};

function sanitizeTag(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^#+/, "")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 40);
}

function toHashtag(raw: string): string | null {
  const clean = sanitizeTag(raw);
  if (clean.length < 2) return null;
  return `#${clean}`;
}

function detectNichePack(topic: string, niche?: string): string[] {
  const hay = `${topic} ${niche ?? ""}`.toLowerCase();
  for (const [key, tags] of Object.entries(NICHE_TREND_PACKS)) {
    if (hay.includes(key)) return tags;
  }
  return [];
}

function localVariants(topic: string, niche?: string): HashtagItem[] {
  const t = sanitizeTag(topic.replace(/\s+/g, ""));
  const n = niche ? sanitizeTag(niche.replace(/\s+/g, "")) : "";
  const items: HashtagItem[] = [];

  if (t) {
    items.push(
      { tag: `#${t}`, bucket: "branded", source: "local" },
      { tag: `#${t}tips`, bucket: "niche", source: "local" },
      { tag: `#${t}community`, bucket: "niche", source: "local" },
      { tag: `#${t}life`, bucket: "niche", source: "local" },
      { tag: `#best${t}`, bucket: "broad", source: "local" },
      { tag: `#${t}2026`, bucket: "trend", source: "local" }
    );
  }
  if (n) {
    items.push(
      { tag: `#${n}`, bucket: "niche", source: "local" },
      { tag: `#${n}gram`, bucket: "branded", source: "local" },
      { tag: `#${n}life`, bucket: "niche", source: "local" }
    );
  }
  return items.filter((i) => i.tag.length > 2);
}

interface DatamuseWord {
  word: string;
  score?: number;
}

export async function fetchDatamuseRelated(topic: string, max = 40): Promise<HashtagItem[]> {
  const query = encodeURIComponent(topic.trim());
  if (!query) return [];

  try {
    const url = `https://api.datamuse.com/words?ml=${query}&max=${max}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as DatamuseWord[];
    return data
      .map((d, i) => {
        const tag = toHashtag(d.word);
        if (!tag) return null;
        const bucket: HashtagItem["bucket"] = i < 8 ? "broad" : i < 24 ? "niche" : "branded";
        return { tag, bucket, source: "datamuse" as const };
      })
      .filter((x): x is HashtagItem => Boolean(x));
  } catch {
    return [];
  }
}

function mixFilter(items: HashtagItem[], mix: HashtagMix): HashtagItem[] {
  if (mix === "balanced") return items;
  if (mix === "broad") return [...items.filter((i) => i.bucket === "broad" || i.bucket === "trend"), ...items];
  if (mix === "niche") return [...items.filter((i) => i.bucket === "niche"), ...items];
  return [...items.filter((i) => i.bucket === "branded"), ...items];
}

function dedupe(items: HashtagItem[]): HashtagItem[] {
  const seen = new Set<string>();
  const out: HashtagItem[] = [];
  for (const item of items) {
    const key = item.tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export async function generateHashtags(req: HashtagRequest): Promise<HashtagResponse> {
  const topic = req.topic.trim();
  const count = Math.min(Math.max(req.count || 15, 5), 30);
  const platform = req.platform;
  const mix = req.mix || "balanced";

  if (!topic) {
    return { hashtags: [], joined: "", source: "fallback" };
  }

  const datamuse = await fetchDatamuseRelated(topic, 45);
  const usedApi = datamuse.length > 0;

  const trendItems: HashtagItem[] = [
    ...PLATFORM_TRENDS[platform].map((t) => ({
      tag: `#${t}`,
      bucket: "trend" as const,
      source: "trend" as const,
    })),
    ...detectNichePack(topic, req.niche).map((t) => ({
      tag: `#${t}`,
      bucket: "niche" as const,
      source: "trend" as const,
    })),
    ...(req.preset ? PRESET_TAGS[req.preset] : []).map((t) => ({
      tag: `#${t}`,
      bucket: "trend" as const,
      source: "trend" as const,
    })),
  ];

  const local = localVariants(topic, req.niche);

  // Interleave: related → trends → local so results feel topical + trendy
  const ordered = mixFilter(dedupe([...datamuse, ...trendItems, ...local]), mix);
  const hashtags = ordered.slice(0, count);

  return {
    hashtags,
    joined: hashtags.map((h) => h.tag).join(" "),
    source: usedApi ? "api" : "fallback",
  };
}
