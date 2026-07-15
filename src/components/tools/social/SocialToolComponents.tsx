"use client";

import { useCallback, useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import ResultCard from "@/components/tools/ResultCard";
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
  const tags = useMemo(() => {
    if (!topic.trim()) return "";
    const base = [topic, keyword, `${topic} tutorial`, `${topic} 2026`, `how to ${topic}`, `${keyword} tips`, `${topic} for beginners`].filter(Boolean);
    return base.join(", ");
  }, [topic, keyword]);
  return <TagGenerator topic={topic} setTopic={setTopic} keyword={keyword} setKeyword={setKeyword} output={tags} label="tags" />;
}

export function YoutubeDescriptionTool() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const output = useMemo(() => {
    if (!title) return "";
    return `${summary}\n\n🔔 Subscribe for more: https://youtube.com/@channel\n\n📌 Chapters:\n0:00 Intro\n\n#${title.replace(/\s+/g, "")} #YouTube`;
  }, [title, summary]);
  return (
    <div className="space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Video title" />
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={6} className="input-field" placeholder="Video summary" />
      {output && <Output output={output} />}
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
  return <EngagementCalc followers={followers} setFollowers={setFollowers} likes={likes} setLikes={setLikes} comments={comments} setComments={setComments} rate={rate} label="Instagram" />;
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
      <ResultCard label="Engagement rate" value={rate} format="percent" />
    </div>
  );
}

export function TiktokEarningsTool() {
  const [views, setViews] = useState(1000000);
  const [rpm, setRpm] = useState(0.03);
  const earnings = (views / 1000) * rpm;
  return (
    <div className="space-y-6">
      <NumInput label="Monthly views" value={views} onChange={setViews} />
      <NumInput label="RPM ($)" value={rpm} onChange={setRpm} step={0.01} />
      <ResultCard label="Estimated earnings" value={earnings} />
      <p className="text-xs text-theme-subtle">Estimates only. Actual TikTok payouts vary by region and program.</p>
    </div>
  );
}

function TagGenerator({ topic, setTopic, keyword, setKeyword, output }: { topic: string; setTopic: (v: string) => void; keyword?: string; setKeyword?: (v: string) => void; output: string; label: string }) {
  return (
    <div className="space-y-4">
      <input value={topic} onChange={(e) => setTopic(e.target.value)} className="input-field" placeholder="Video topic" />
      {setKeyword && <input value={keyword ?? ""} onChange={(e) => setKeyword(e.target.value)} className="input-field" placeholder="Main keyword" />}
      {output && <Output output={output} />}
    </div>
  );
}

function EngagementCalc({ followers, setFollowers, likes, setLikes, comments, setComments, rate, label }: {
  followers: number; setFollowers: (n: number) => void;
  likes: number; setLikes: (n: number) => void;
  comments: number; setComments: (n: number) => void;
  rate: number; label: string;
}) {
  return (
    <div className="space-y-6">
      <NumInput label="Followers" value={followers} onChange={setFollowers} />
      <NumInput label="Likes (avg post)" value={likes} onChange={setLikes} />
      <NumInput label="Comments (avg post)" value={comments} onChange={setComments} />
      <ResultCard label={`${label} engagement rate`} value={rate} format="percent" />
      <p className="text-xs text-theme-subtle">Benchmark: 1–3% is average; 6%+ is strong for most niches.</p>
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

function Output({ output }: { output: string }) {
  return (
    <div className="glass-card p-4">
      <div className="mb-2 flex justify-end"><CopyButton text={output} /></div>
      <p className="text-sm text-theme-muted">{output}</p>
    </div>
  );
}
