import { TOOL_POPULARITY_ORDER } from "./toolPopularity";

const STORAGE_KEY = "ranburg_tool_analytics_v1";
const MAX_RECENT = 12;
const MAX_SEARCHES = 20;

export interface ToolViewRecord {
  slug: string;
  total: number;
  lastViewed: number;
  weekViews: number;
  weekStart: number;
}

export interface AnalyticsStore {
  views: Record<string, ToolViewRecord>;
  searches: { query: string; ts: number }[];
  categoryClicks: Record<string, number>;
}

function weekStartMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

function emptyStore(): AnalyticsStore {
  return { views: {}, searches: [], categoryClicks: {} };
}

export function loadAnalytics(): AnalyticsStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return { ...emptyStore(), ...JSON.parse(raw) };
  } catch {
    return emptyStore();
  }
}

function saveAnalytics(store: AnalyticsStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota exceeded */
  }
}

export function trackToolView(slug: string): void {
  const store = loadAnalytics();
  const now = Date.now();
  const ws = weekStartMs();
  const existing = store.views[slug];
  const weekViews =
    existing && existing.weekStart === ws ? existing.weekViews + 1 : 1;

  store.views[slug] = {
    slug,
    total: (existing?.total ?? 0) + 1,
    lastViewed: now,
    weekViews,
    weekStart: ws,
  };
  saveAnalytics(store);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics/event",
      JSON.stringify({ type: "tool_view", slug, ts: now })
    );
  }
}

export function trackPageExit(slug: string): void {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics/event",
      JSON.stringify({ type: "page_exit", slug, ts: Date.now() })
    );
  }
}

export function trackSearch(query: string): void {
  const q = query.trim();
  if (!q || q.length < 2) return;
  const store = loadAnalytics();
  store.searches = [{ query: q, ts: Date.now() }, ...store.searches.filter((s) => s.query !== q)].slice(
    0,
    MAX_SEARCHES
  );
  saveAnalytics(store);
}

export function trackCategoryClick(category: string): void {
  const store = loadAnalytics();
  store.categoryClicks[category] = (store.categoryClicks[category] ?? 0) + 1;
  saveAnalytics(store);
}

export function getRecentlyViewedSlugs(limit = 6): string[] {
  const store = loadAnalytics();
  return Object.values(store.views)
    .sort((a, b) => b.lastViewed - a.lastViewed)
    .slice(0, limit)
    .map((v) => v.slug);
}

export function getRecentSearches(limit = 6): string[] {
  return loadAnalytics()
    .searches.slice(0, limit)
    .map((s) => s.query);
}

export function getPopularSearches(): string[] {
  const store = loadAnalytics();
  const counts = new Map<string, number>();
  for (const s of store.searches) {
    counts.set(s.query, (counts.get(s.query) ?? 0) + 1);
  }
  const fromHistory = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([q]) => q);
  const defaults = ["GST", "JSON", "Password", "YouTube", "Instagram", "EMI", "Invoice", "Regex"];
  return [...new Set([...fromHistory, ...defaults])].slice(0, 8);
}

function baselineScore(slug: string): number {
  const idx = TOOL_POPULARITY_ORDER.indexOf(slug);
  return idx >= 0 ? TOOL_POPULARITY_ORDER.length - idx : 0;
}

export function getToolsByMetric(
  metric: "trending" | "most_used" | "popular_week",
  limit = 6
): { slug: string; count: number }[] {
  const store = loadAnalytics();
  const slugs = new Set([...TOOL_POPULARITY_ORDER, ...Object.keys(store.views)]);

  const scored = [...slugs].map((slug) => {
    const v = store.views[slug];
    const baseline = baselineScore(slug);
    let count = baseline;
    if (metric === "most_used") count = (v?.total ?? 0) + baseline * 10;
    else if (metric === "popular_week") count = (v?.weekViews ?? 0) + baseline * 5;
    else count = (v?.total ?? 0) + (v?.weekViews ?? 0) * 2 + baseline * 3;
    return { slug, count };
  });

  return scored.sort((a, b) => b.count - a.count).slice(0, limit);
}

export function getToolViewCount(slug: string): number {
  return loadAnalytics().views[slug]?.total ?? 0;
}

export { MAX_RECENT };
