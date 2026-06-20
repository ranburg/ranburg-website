"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export function KeywordDensityTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
    const total = words.length || 1;
    const freq: Record<string, number> = {};
    words.forEach((w) => { freq[w] = (freq[w] ?? 0) + 1; });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count, density: ((count / total) * 100).toFixed(2) }));
  }, [text]);

  return (
    <div className="space-y-6">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="input-field" placeholder="Paste your content…" />
      {stats.length > 0 && (
        <div className="glass-card overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-theme-subtle"><th className="pb-2">Keyword</th><th>Count</th><th>Density %</th></tr></thead>
            <tbody>{stats.map((s) => <tr key={s.word} className="border-t border-theme-subtle"><td className="py-2">{s.word}</td><td>{s.count}</td><td>{s.density}%</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("https://");
  const [robots, setRobots] = useState("index, follow");
  const output = `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<meta name="robots" content="${robots}" />\n<link rel="canonical" href="${url}" />`;
  return <GeneratorForm fields={[
    { label: "Title", value: title, set: setTitle },
    { label: "Description", value: desc, set: setDesc, multiline: true },
    { label: "Canonical URL", value: url, set: setUrl },
    { label: "Robots", value: robots, set: setRobots },
  ]} output={output} />;
}

export function RobotsTxtTool() {
  const [ua, setUa] = useState("*");
  const [disallow, setDisallow] = useState("/admin/");
  const [allow, setAllow] = useState("");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const output = `User-agent: ${ua}\n${disallow ? `Disallow: ${disallow}\n` : ""}${allow ? `Allow: ${allow}\n` : ""}\nSitemap: ${sitemap}`;
  return <GeneratorForm fields={[
    { label: "User-agent", value: ua, set: setUa },
    { label: "Disallow", value: disallow, set: setDisallow },
    { label: "Allow (optional)", value: allow, set: setAllow },
    { label: "Sitemap URL", value: sitemap, set: setSitemap },
  ]} output={output} />;
}

export function XmlSitemapTool() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about");
  const [priority, setPriority] = useState("0.8");
  const [freq, setFreq] = useState("weekly");
  const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.split("\n").filter(Boolean).map((u) => `  <url>\n    <loc>${u.trim()}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
  return (
    <div className="space-y-4">
      <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={8} className="input-field font-mono text-sm" placeholder="One URL per line" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field" placeholder="Priority" />
        <select value={freq} onChange={(e) => setFreq(e.target.value)} className="input-field">
          {["always", "hourly", "daily", "weekly", "monthly", "yearly"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <OutputBlock output={output} />
    </div>
  );
}

export function OpenGraphTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const output = `<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:url" content="${url}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />`;
  return <GeneratorForm fields={[
    { label: "Title", value: title, set: setTitle },
    { label: "Description", value: desc, set: setDesc, multiline: true },
    { label: "Image URL", value: image, set: setImage },
    { label: "Page URL", value: url, set: setUrl },
  ]} output={output} />;
}

export function SchemaMarkupTool() {
  const [type, setType] = useState("Article");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const output = `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@type": type, name, description: desc, url }, null, 2)}\n</script>`;
  return (
    <div className="space-y-4">
      <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
        {["Article", "Product", "Organization", "FAQPage", "WebPage"].map((t) => <option key={t}>{t}</option>)}
      </select>
      <GeneratorForm fields={[
        { label: "Name", value: name, set: setName },
        { label: "Description", value: desc, set: setDesc, multiline: true },
        { label: "URL", value: url, set: setUrl },
      ]} output={output} hideOutput />
      <OutputBlock output={output} />
    </div>
  );
}

export function UrlEncoderTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const output = useMemo(() => {
    try {
      return mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
    } catch {
      return "Invalid encoded string";
    }
  }, [text, mode]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-lg px-4 py-2 text-sm capitalize ${mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted"}`}>{m}</button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="input-field" />
      <OutputBlock output={output} />
    </div>
  );
}

export function WordCounterTool() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const reading = Math.ceil(words / 200);
  return (
    <div className="space-y-6">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="input-field" placeholder="Paste text…" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Words", value: words },
          { label: "Characters", value: chars },
          { label: "Sentences", value: sentences },
          { label: "Reading time", value: `${reading} min` },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-theme-subtle">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SlugGeneratorTool() {
  const [text, setText] = useState("");
  const slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
  return (
    <div className="space-y-4">
      <input value={text} onChange={(e) => setText(e.target.value)} className="input-field" placeholder="Enter title or phrase" />
      <OutputBlock output={slug} />
    </div>
  );
}

function GeneratorForm({ fields, output, hideOutput }: { fields: { label: string; value: string; set: (v: string) => void; multiline?: boolean }[]; output: string; hideOutput?: boolean }) {
  return (
    <div className="space-y-4">
      {fields.map((f) =>
        f.multiline ? (
          <textarea key={f.label} value={f.value} onChange={(e) => f.set(e.target.value)} rows={3} className="input-field" placeholder={f.label} />
        ) : (
          <input key={f.label} value={f.value} onChange={(e) => f.set(e.target.value)} className="input-field" placeholder={f.label} />
        )
      )}
      {!hideOutput && <OutputBlock output={output} />}
    </div>
  );
}

function OutputBlock({ output }: { output: string }) {
  return (
    <div className="glass-card p-4">
      <div className="mb-2 flex justify-end"><CopyButton text={output} /></div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-theme-muted">{output}</pre>
    </div>
  );
}
