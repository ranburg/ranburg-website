"use client";

import { useCallback, useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { KPIStrip, BenchmarkGauge, CopyResultPanel } from "@/components/tools/viz";
import type { HashtagItem, HashtagMix, HashtagPlatform, HashtagPreset } from "@/lib/hashtagGenerator";

const PLATFORMS = [
  { name: "Twitter/X", limit: 280 },
  { name: "Instagram caption", limit: 2200 },
  { name: "LinkedIn", limit: 3000 },
  { name: "YouTube description", limit: 5000 },
  { name: "TikTok caption", limit: 2200 },
];

export function SocialCharacterCounterTool() {
  const [text, setText] = useState("");
  const len = [...text].length;
  return (
    <div className="space-y-6">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="input-field" placeholder="Paste caption or post…" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p) => (
          <div key={p.name} className={`glass-card p-4 ${len > p.limit ? "border-red-400/50" : ""}`}>
            <p className="text-sm font-medium text-theme-heading">{p.name}</p>
            <p className="mt-1 text-lg font-bold text-accent">{len} / {p.limit}</p>
            <p className="text-xs text-theme-subtle">{len > p.limit ? "Over limit" : `${p.limit - len} remaining`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function YoutubeTagsTool() {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [niche, setNiche] = useState("");
  const [count, setCount] = useState(12);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [deselected, setDeselected] = useState<Set<string>>(new Set());

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setDeselected(new Set());
    try {
      const params = new URLSearchParams({
        topic: topic.trim(),
        platform: "youtube",
        count: String(Math.min(count + 5, 30)),
        mix: "balanced",
        preset: "long-form",
      });
      if (niche.trim()) params.set("niche", niche.trim());
      const res = await fetch(`/api/hashtags?${params}`);
      const data = await res.json();
      const fromApi = (data.hashtags as { tag: string }[] | undefined)?.map((h) =>
        h.tag.replace(/^#/, "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()
      ) ?? [];
      const local = [
        topic,
        keyword,
        niche,
        `${topic} tutorial`,
        `how to ${topic}`,
        `${keyword || topic} tips`,
        `${topic} for beginners`,
        `${topic} 2026`,
        `${topic} explained`,
        `${niche || topic} guide`,
      ]
        .filter(Boolean)
        .map((t) => t.trim().toLowerCase());
      const merged = [...new Set([...local, ...fromApi])].filter(Boolean).slice(0, count);
      setTags(merged);
    } catch {
      const fallback = [topic, keyword, `${topic} tutorial`, `how to ${topic}`, `${topic} for beginners`]
        .filter(Boolean)
        .slice(0, count);
      setTags(fallback);
    } finally {
      setLoading(false);
    }
  };

  const visible = tags.filter((t) => !deselected.has(t));
  const joined = visible.join(", ");

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} className="input-field sm:col-span-2" placeholder="Video topic" />
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-field" placeholder="Main keyword" />
        <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input-field" placeholder="Niche (optional)" />
      </div>
      <div>
        <label className="flex justify-between text-sm text-theme-muted">
          <span>Tag count</span>
          <span className="font-semibold text-accent">{count}</span>
        </label>
        <input type="range" min={5} max={25} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-2 w-full" />
      </div>
      <button type="button" onClick={generate} disabled={loading} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {loading ? "Generating…" : "Generate tags"}
      </button>
      {tags.length > 0 && (
        <CopyResultPanel title="YouTube tags" text={joined} emptyHint="Generate tags to copy.">
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((t) => {
              const on = !deselected.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setDeselected((prev) => {
                      const next = new Set(prev);
                      if (next.has(t)) next.delete(t);
                      else next.add(t);
                      return next;
                    })
                  }
                  className={`rounded-full border px-3 py-1 text-sm ${on ? "border-accent/40 bg-accent/10 text-accent" : "opacity-40 line-through"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </CopyResultPanel>
      )}
    </div>
  );
}

export function YoutubeDescriptionTool() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [chapters, setChapters] = useState("0:00 Intro\n1:00 Main topic\n8:00 Wrap-up");
  const [cta, setCta] = useState("Like & subscribe for more.");
  const [hashtags, setHashtags] = useState("");

  const output = useMemo(() => {
    if (!title.trim()) return "";
    const lines = [
      title.trim(),
      "",
      summary.trim(),
      "",
      cta.trim(),
      channelUrl.trim() ? `🔔 Subscribe: ${channelUrl.trim()}` : "",
      "",
      "📌 Chapters:",
      chapters.trim(),
      "",
      hashtags.trim() || `#${title.replace(/\s+/g, "")} #YouTube`,
    ];
    return lines.filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n").trim();
  }, [title, summary, channelUrl, chapters, cta, hashtags]);

  return (
    <div className="space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Video title" />
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} className="input-field" placeholder="Video summary / hook" />
      <input value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} className="input-field" placeholder="Channel URL (e.g. https://youtube.com/@yourhandle)" />
      <textarea value={chapters} onChange={(e) => setChapters(e.target.value)} rows={4} className="input-field font-mono text-sm" placeholder="Chapters (one per line)" />
      <input value={cta} onChange={(e) => setCta(e.target.value)} className="input-field" placeholder="Call to action" />
      <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="input-field" placeholder="Hashtags (optional)" />
      <CopyResultPanel title="Description" text={output} emptyHint="Enter a title to build your description." />
      {output && (
        <KPIStrip
          items={[
            { label: "Characters", value: String([...output].length), hint: "YouTube limit 5000" },
            { label: "Chapters", value: String(chapters.split("\n").filter(Boolean).length) },
          ]}
        />
      )}
    </div>
  );
}

export function YoutubeHashtagTool() {
  return (
    <HashtagGeneratorPanel
      platform="youtube"
      defaultCount={12}
      defaultPreset="shorts"
      showNiche={false}
      presets={[
        { value: "shorts", label: "Shorts" },
        { value: "long-form", label: "Long-form" },
      ]}
    />
  );
}

export function InstagramHashtagTool() {
  return (
    <HashtagGeneratorPanel
      platform="instagram"
      defaultCount={20}
      defaultPreset="reels"
      showNiche
      presets={[
        { value: "reels", label: "Reels" },
        { value: "feed", label: "Feed post" },
      ]}
    />
  );
}

const MIX_OPTIONS: { value: HashtagMix; label: string; hint: string }[] = [
  { value: "balanced", label: "Balanced", hint: "Broad + niche + branded" },
  { value: "broad", label: "Broad", hint: "High-reach / trending" },
  { value: "niche", label: "Niche", hint: "Targeted discovery" },
  { value: "branded", label: "Branded", hint: "Topic-specific" },
];

function HashtagGeneratorPanel({
  platform,
  defaultCount,
  defaultPreset,
  showNiche,
  presets,
}: {
  platform: HashtagPlatform;
  defaultCount: number;
  defaultPreset: HashtagPreset;
  showNiche: boolean;
  presets: { value: HashtagPreset; label: string }[];
}) {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [count, setCount] = useState(defaultCount);
  const [mix, setMix] = useState<HashtagMix>("balanced");
  const [preset, setPreset] = useState<HashtagPreset>(defaultPreset);
  const [items, setItems] = useState<HashtagItem[]>([]);
  const [joined, setJoined] = useState("");
  const [source, setSource] = useState<"api" | "fallback" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deselected, setDeselected] = useState<Set<string>>(new Set());

  const visibleJoined = useMemo(() => {
    return items
      .filter((i) => !deselected.has(i.tag))
      .map((i) => i.tag)
      .join(" ");
  }, [items, deselected]);

  const generate = useCallback(async () => {
    if (!topic.trim() || topic.trim().length < 2) {
      setError("Enter a topic (at least 2 characters).");
      return;
    }
    setLoading(true);
    setError(null);
    setDeselected(new Set());

    try {
      const params = new URLSearchParams({
        topic: topic.trim(),
        platform,
        count: String(count),
        mix,
        preset,
      });
      if (showNiche && niche.trim()) params.set("niche", niche.trim());

      const res = await fetch(`/api/hashtags?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to generate hashtags");
      }
      const data = await res.json();
      setItems(data.hashtags ?? []);
      setJoined(data.joined ?? "");
      setSource(data.source ?? "fallback");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setItems([]);
      setJoined("");
      setSource(null);
    } finally {
      setLoading(false);
    }
  }, [topic, niche, platform, count, mix, preset, showNiche]);

  const toggleTag = (tag: string) => {
    setDeselected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm text-theme-muted">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            className="input-field mt-1"
            placeholder={platform === "youtube" ? "e.g. home workout tips" : "e.g. morning skincare routine"}
          />
        </div>
        {showNiche && (
          <div className="sm:col-span-2">
            <label className="text-sm text-theme-muted">Niche (optional)</label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="input-field mt-1"
              placeholder="e.g. beauty, fitness, tech"
            />
          </div>
        )}

        <div>
          <label className="flex items-center justify-between text-sm text-theme-muted">
            <span>Number of tags</span>
            <span className="font-semibold tabular-nums text-accent">{count}</span>
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-theme-subtle">
            <span>5</span>
            <span>30</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-theme-muted">Format</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPreset(p.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  preset === p.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-theme-subtle text-theme-muted hover:border-accent/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm text-theme-muted">Hashtag mix</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {MIX_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMix(opt.value)}
              className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                mix === opt.value
                  ? "border-accent bg-accent/10"
                  : "border-theme-subtle hover:border-accent/30"
              }`}
            >
              <p className="text-sm font-semibold text-theme-heading">{opt.label}</p>
              <p className="mt-0.5 text-xs text-theme-subtle">{opt.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Generating…" : "Generate hashtags"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {items.length > 0 && (
        <div className="space-y-4 rounded-xl border border-theme-subtle bg-theme-surface/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-theme-heading">
                {items.filter((i) => !deselected.has(i.tag)).length} hashtags ready
              </p>
              {source && (
                <p className="mt-0.5 text-xs text-theme-subtle">
                  {source === "api"
                    ? "Related terms via Datamuse + trend packs"
                    : "Built from topic variants + trend packs"}
                </p>
              )}
            </div>
            <CopyButton text={visibleJoined || joined} />
          </div>

          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const on = !deselected.has(item.tag);
              return (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => toggleTag(item.tag)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    on
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-theme-subtle text-theme-subtle line-through opacity-50"
                  }`}
                  title={`${item.bucket} · ${item.source}`}
                >
                  {item.tag}
                </button>
              );
            })}
          </div>

          <p className="break-all text-sm leading-relaxed text-theme-muted">{visibleJoined}</p>
        </div>
      )}
    </div>
  );
}

export function InstagramEngagementTool() {
  const [followers, setFollowers] = useState(10000);
  const [likes, setLikes] = useState(500);
  const [comments, setComments] = useState(25);
  const rate = followers > 0 ? ((likes + comments) / followers) * 100 : 0;
  const tip =
    rate >= 6 ? "Excellent — strong niche fit or highly engaging creative." :
    rate >= 3 ? "Above average — keep posting consistently." :
    rate >= 1 ? "Average — test hooks and CTAs." :
    "Low — try Reels and clearer calls-to-action.";
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumInput label="Followers" value={followers} onChange={setFollowers} />
        <NumInput label="Likes (avg post)" value={likes} onChange={setLikes} />
        <NumInput label="Comments (avg post)" value={comments} onChange={setComments} />
      </div>
      <KPIStrip
        items={[
          { label: "Engagement rate", value: `${rate.toFixed(2)}%`, highlight: true },
          { label: "Interactions", value: (likes + comments).toLocaleString() },
          { label: "Per 1k followers", value: followers > 0 ? (((likes + comments) / followers) * 1000).toFixed(1) : "0" },
        ]}
      />
      <BenchmarkGauge value={rate} title="Instagram engagement vs typical" />
      <p className="text-sm text-theme-muted">{tip}</p>
    </div>
  );
}

export function TiktokEngagementTool() {
  const [views, setViews] = useState(100000);
  const [likes, setLikes] = useState(5000);
  const [comments, setComments] = useState(200);
  const [shares, setShares] = useState(100);
  const rate = views > 0 ? ((likes + comments + shares) / views) * 100 : 0;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumInput label="Views" value={views} onChange={setViews} />
        <NumInput label="Likes" value={likes} onChange={setLikes} />
        <NumInput label="Comments" value={comments} onChange={setComments} />
        <NumInput label="Shares" value={shares} onChange={setShares} />
      </div>
      <KPIStrip
        items={[
          { label: "Engagement rate", value: `${rate.toFixed(2)}%`, highlight: true },
          { label: "Total interactions", value: (likes + comments + shares).toLocaleString() },
          { label: "Share rate", value: views > 0 ? `${((shares / views) * 100).toFixed(2)}%` : "0%" },
        ]}
      />
      <BenchmarkGauge
        value={rate}
        title="TikTok engagement vs typical"
        bands={[
          { label: "Low", min: 0, max: 3, color: "bg-amber-500" },
          { label: "Average", min: 3, max: 6, color: "bg-accent" },
          { label: "Strong", min: 6, max: 10, color: "bg-accent-emerald" },
          { label: "Viral-ish", min: 10, max: 100, color: "bg-emerald-400" },
        ]}
      />
    </div>
  );
}

export function TiktokEarningsTool() {
  const [views, setViews] = useState(1000000);
  const [rpm, setRpm] = useState(0.03);
  const low = (views / 1000) * (rpm * 0.5);
  const mid = (views / 1000) * rpm;
  const high = (views / 1000) * (rpm * 1.8);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumInput label="Monthly views" value={views} onChange={setViews} />
        <NumInput label="Assumed RPM ($)" value={rpm} onChange={setRpm} step={0.01} />
      </div>
      <KPIStrip
        items={[
          { label: "Conservative", value: `$${low.toFixed(2)}`, hint: "0.5× RPM" },
          { label: "Likely", value: `$${mid.toFixed(2)}`, highlight: true, hint: "Your RPM" },
          { label: "Optimistic", value: `$${high.toFixed(2)}`, hint: "1.8× RPM" },
        ]}
      />
      <div className="rounded-xl border border-theme-subtle bg-theme-surface/40 p-4 text-sm text-theme-muted">
        <p className="font-semibold text-theme-heading">Assumptions</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Creator Rewards / ads vary heavily by country and niche.</li>
          <li>RPM here means estimated earnings per 1,000 views.</li>
          <li>Use the range for planning — not a payout guarantee.</li>
        </ul>
      </div>
    </div>
  );
}

function NumInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <div>
      <label className="text-sm text-theme-muted">{label}</label>
      <input type="number" value={value} step={step} onChange={(e) => onChange(Number(e.target.value))} className="input-field mt-1" />
    </div>
  );
}
