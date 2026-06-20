"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import ResultCard from "@/components/tools/ResultCard";

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
  const [topic, setTopic] = useState("");
  const output = useMemo(() => {
    if (!topic) return "";
    const t = topic.replace(/\s+/g, "");
    return [`#${t}`, `#${t}Tips`, `#YouTube`, `#Shorts`, `#Creator`].slice(0, 15).join(" ");
  }, [topic]);
  return <TagGenerator topic={topic} setTopic={setTopic} output={output} label="hashtags" />;
}

export function InstagramHashtagTool() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const output = useMemo(() => {
    if (!topic) return "";
    const tags = [topic, niche, `${topic}life`, `${topic}community`, `insta${topic}`, `${niche}gram`].filter(Boolean).map((t) => `#${t.replace(/\s+/g, "")}`);
    return tags.slice(0, 30).join(" ");
  }, [topic, niche]);
  return (
    <div className="space-y-4">
      <input value={topic} onChange={(e) => setTopic(e.target.value)} className="input-field" placeholder="Post topic" />
      <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input-field" placeholder="Niche (optional)" />
      {output && <Output output={output} />}
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

function TagGenerator({ topic, setTopic, keyword, setKeyword, output, label }: { topic: string; setTopic: (v: string) => void; keyword?: string; setKeyword?: (v: string) => void; output: string; label: string }) {
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
