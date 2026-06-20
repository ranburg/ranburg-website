/**
 * Server-only Instagram profile fetching.
 * Uses got-scraping for browser TLS impersonation (required on Vercel/datacenter IPs).
 */

import {
  parseInstagramEmbeddedJson,
  parseInstagramOgMeta,
  parseInstagramWebProfile,
  type InstagramProfileData,
} from "./socialInsights";

const IG_WEB_APP_ID = "936619743392459";

const IG_USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];

function profileApiUrl(username: string): string {
  return `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
}

function igApiHeaders(userAgent: string, username?: string): Record<string, string> {
  return {
    "User-Agent": userAgent,
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "X-IG-App-ID": IG_WEB_APP_ID,
    ...(username
      ? {
          Referer: `https://www.instagram.com/${username}/`,
          Origin: "https://www.instagram.com",
        }
      : {}),
  };
}

async function gotFetchText(url: string, headers: Record<string, string>): Promise<string | null> {
  try {
    const { gotScraping } = await import("got-scraping");
    const response = await gotScraping({
      url,
      headers,
      timeout: { request: 25_000 },
      retry: { limit: 1 },
      http2: true,
    });
    if (response.statusCode < 200 || response.statusCode >= 300) return null;
    return response.body;
  } catch {
    return null;
  }
}

async function nativeFetchText(url: string, headers: Record<string, string>): Promise<string | null> {
  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

function parseProfileJson(body: string, username: string): InstagramProfileData | null {
  try {
    const json = JSON.parse(body);
    if ((json as { status?: string }).status === "fail") return null;
    return parseInstagramWebProfile(json, username);
  } catch {
    return null;
  }
}

async function fetchDirectProfileApi(username: string): Promise<InstagramProfileData | null> {
  const url = profileApiUrl(username);

  for (const userAgent of IG_USER_AGENTS) {
    const headers = igApiHeaders(userAgent, username);

    const scraped = await gotFetchText(url, headers);
    if (scraped) {
      const profile = parseProfileJson(scraped, username);
      if (profile) return profile;
    }

    const native = await nativeFetchText(url, headers);
    if (native) {
      const profile = parseProfileJson(native, username);
      if (profile) return profile;
    }
  }

  return null;
}

async function fetchViaScraperApi(username: string): Promise<InstagramProfileData | null> {
  const key = process.env.SCRAPER_API_KEY;
  if (!key) return null;

  const target = profileApiUrl(username);
  const proxyUrl = `https://api.scraperapi.com?api_key=${key}&url=${encodeURIComponent(target)}`;

  const body = await nativeFetchText(proxyUrl, {});
  if (!body) return null;
  return parseProfileJson(body, username);
}

async function fetchViaRapidApi(username: string): Promise<InstagramProfileData | null> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  const host = process.env.RAPIDAPI_INSTAGRAM_HOST ?? "instagram-cheapest.p.rapidapi.com";
  const url = `https://${host}/api/v1/user_info?username=${encodeURIComponent(username)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const user =
      (json as { data?: Record<string, unknown> }).data ??
      (json as { user?: Record<string, unknown> }).user ??
      json;
    if (!user || typeof user !== "object") return null;

    const u = user as Record<string, unknown>;
    const followers =
      (u.follower_count as number) ??
      (u.edge_followed_by as { count?: number })?.count ??
      0;
    const following =
      (u.following_count as number) ??
      (u.edge_follow as { count?: number })?.count ??
      0;
    const posts =
      (u.media_count as number) ??
      (u.edge_owner_to_timeline_media as { count?: number })?.count ??
      0;

    if (!followers && !posts) return null;

    return {
      displayName: (u.full_name as string) || username,
      username: (u.username as string) || username,
      bio: (u.biography as string) || "",
      followers,
      following,
      posts,
      avatarUrl:
        (u.profile_pic_url_hd as string) || (u.profile_pic_url as string) || "",
      isPrivate: Boolean(u.is_private),
    };
  } catch {
    return null;
  }
}

async function fetchProfileHtml(username: string): Promise<string | null> {
  const url = `https://www.instagram.com/${username}/`;
  const headers = {
    "User-Agent": IG_USER_AGENTS[0],
    Accept: "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.instagram.com/",
  };

  return (await gotFetchText(url, headers)) ?? (await nativeFetchText(url, headers));
}

export async function fetchInstagramWebProfile(username: string): Promise<InstagramProfileData | null> {
  const direct = await fetchDirectProfileApi(username);
  if (direct) return direct;

  const viaScraper = await fetchViaScraperApi(username);
  if (viaScraper) return viaScraper;

  const viaRapid = await fetchViaRapidApi(username);
  if (viaRapid) return viaRapid;

  return null;
}

export async function fetchInstagramHtmlProfile(username: string): Promise<string | null> {
  return fetchProfileHtml(username);
}

export async function resolveInstagramProfile(username: string): Promise<InstagramProfileData | null> {
  let profile = await fetchInstagramWebProfile(username);

  if (!profile) {
    const html = await fetchInstagramHtmlProfile(username);
    if (html) {
      profile =
        parseInstagramEmbeddedJson(html, username) ??
        (() => {
          const parsed = parseInstagramOgMeta(html);
          if (!parsed) return null;
          return {
            displayName: parsed.displayName || username,
            username: parsed.username || username,
            bio: parsed.bio,
            followers: parsed.followers,
            following: parsed.following,
            posts: parsed.posts,
            avatarUrl: parsed.avatarUrl,
            isPrivate: false,
          };
        })();
    }
  }

  return profile;
}
