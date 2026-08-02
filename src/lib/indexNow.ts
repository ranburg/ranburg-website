import { SITE } from "@/lib/siteConfig";
import { getPriorityIndexUrls } from "@/lib/seoGrowthConfig";

/**
 * IndexNow — notify Bing, Yandex, Seznam, Naver (not Google) of URL updates.
 * Spec: https://www.indexnow.org/documentation
 *
 * Key must be 8–128 hexadecimal characters and hosted at keyLocation.
 */
const DEFAULT_INDEXNOW_KEY = "c8e4a1f29b7d6e503a9c1f84e2b6d0a7";

export function getIndexNowKey(): string {
  const fromEnv = process.env.INDEXNOW_KEY?.trim();
  if (fromEnv && /^[a-fA-F0-9]{8,128}$/.test(fromEnv)) return fromEnv;
  return DEFAULT_INDEXNOW_KEY;
}

export function getIndexNowKeyLocation(): string {
  return `${SITE.url}/indexnow-key.txt`;
}

export function getIndexNowHost(): string {
  return new URL(SITE.url).host;
}

/** Max URLs per IndexNow request (protocol allows up to 10,000). */
const MAX_URLS_PER_REQUEST = 100;

export type IndexNowResult = {
  ok: boolean;
  status: number;
  submitted: number;
  host: string;
  keyLocation: string;
  endpoint: string;
  bodyPreview?: string;
  error?: string;
};

function assertOurHost(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.host === getIndexNowHost();
  } catch {
    return false;
  }
}

export function filterIndexableUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const url = raw.trim();
    if (!url || seen.has(url) || !assertOurHost(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= MAX_URLS_PER_REQUEST) break;
  }
  return out;
}

/**
 * Submit URL list to IndexNow (api.indexnow.org fans out to participating engines).
 */
export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = getIndexNowKey();
  const host = getIndexNowHost();
  const keyLocation = getIndexNowKeyLocation();
  const urlList = filterIndexableUrls(urls);
  const endpoint = "https://api.indexnow.org/indexnow";

  if (urlList.length === 0) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      host,
      keyLocation,
      endpoint,
      error: "No valid https URLs for this host to submit.",
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    // 200 / 202 = accepted; 204 sometimes used
    const ok = res.status === 200 || res.status === 202 || res.status === 204;

    return {
      ok,
      status: res.status,
      submitted: urlList.length,
      host,
      keyLocation,
      endpoint,
      bodyPreview: text.slice(0, 300) || undefined,
      error: ok ? undefined : text.slice(0, 300) || `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      submitted: urlList.length,
      host,
      keyLocation,
      endpoint,
      error: err instanceof Error ? err.message : "IndexNow request failed",
    };
  }
}

export function getDefaultIndexNowUrls(): string[] {
  return getPriorityIndexUrls();
}

export function isIndexNowSubmitAuthorized(request: Request): boolean {
  const secret =
    process.env.INDEXNOW_SUBMIT_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "";
  if (!secret) return false;

  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;

  const headerSecret = request.headers.get("x-indexnow-secret") || "";
  if (headerSecret === secret) return true;

  try {
    const url = new URL(request.url);
    if (url.searchParams.get("secret") === secret) return true;
  } catch {
    /* ignore */
  }

  return false;
}
