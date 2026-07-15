"use client";

import { useMemo, useState } from "react";
import { CopyResultPanel, KPIStrip, SerpPreview, OgCardPreview } from "@/components/tools/viz";

export function KeywordDensityTool() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  const total = words.length || 1;
  const targetCount = target.trim()
    ? words.filter((w) => w === target.trim().toLowerCase()).length
    : 0;
  const targetDensity = (targetCount / total) * 100;

  const stats = useMemo(() => {
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      freq[w] = (freq[w] ?? 0) + 1;
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count, density: (count / total) * 100 }));
  }, [text, total, words]);

  return (
    <div className="space-y-6">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="input-field" placeholder="Paste your content…" />
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="input-field"
        placeholder="Focus keyword (optional)"
      />
      {text.trim() && (
        <KPIStrip
          items={[
            { label: "Words", value: String(words.length) },
            { label: "Unique", value: String(stats.length) },
            ...(target.trim()
              ? [{ label: `"${target}" density`, value: `${targetDensity.toFixed(2)}%`, highlight: true as const }]
              : []),
          ]}
        />
      )}
      {target.trim() && text.trim() && (
        <div className="rounded-xl border border-theme-subtle p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">Focus keyword density</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-theme-subtle/40">
            <div
              className={`h-full rounded-full ${targetDensity > 3 ? "bg-amber-500" : targetDensity < 0.5 ? "bg-theme-subtle" : "bg-accent-emerald"}`}
              style={{ width: `${Math.min(targetDensity * 12, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-theme-muted">
            Ideal often ~0.5–2.5%. Current: <strong className="text-theme-heading">{targetDensity.toFixed(2)}%</strong> ({targetCount} uses)
          </p>
        </div>
      )}
      {stats.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-theme-subtle p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-theme-subtle">
                <th className="pb-2">Keyword</th>
                <th>Count</th>
                <th>Density</th>
                <th className="w-1/3">Bar</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.word} className="border-t border-theme-subtle">
                  <td className="py-2 font-medium text-theme-heading">{s.word}</td>
                  <td>{s.count}</td>
                  <td>{s.density.toFixed(2)}%</td>
                  <td>
                    <div className="h-2 overflow-hidden rounded-full bg-theme-subtle/30">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(s.density * 8, 100)}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("https://example.com");
  const [robots, setRobots] = useState("index, follow");
  const output = `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<meta name="robots" content="${robots}" />\n<link rel="canonical" href="${url}" />`;
  return (
    <div className="space-y-5">
      <GeneratorForm
        fields={[
          { label: "Title", value: title, set: setTitle },
          { label: "Description", value: desc, set: setDesc, multiline: true },
          { label: "Canonical URL", value: url, set: setUrl },
          { label: "Robots", value: robots, set: setRobots },
        ]}
        output={output}
        hideOutput
      />
      <div>
        <p className="mb-2 text-sm font-semibold text-theme-heading">Google SERP preview</p>
        <SerpPreview title={title} description={desc} url={url} />
        <p className="mt-2 text-xs text-theme-subtle">
          Title {title.length}/60 · Description {desc.length}/160
        </p>
      </div>
      <CopyResultPanel title="HTML tags" text={title || desc ? output : ""} />
    </div>
  );
}

export function RobotsTxtTool() {
  const [ua, setUa] = useState("*");
  const [disallow, setDisallow] = useState("/admin/");
  const [allow, setAllow] = useState("");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const output = `User-agent: ${ua}\n${disallow ? `Disallow: ${disallow}\n` : ""}${allow ? `Allow: ${allow}\n` : ""}\nSitemap: ${sitemap}`;
  return (
    <GeneratorForm
      fields={[
        { label: "User-agent", value: ua, set: setUa },
        { label: "Disallow", value: disallow, set: setDisallow },
        { label: "Allow (optional)", value: allow, set: setAllow },
        { label: "Sitemap URL", value: sitemap, set: setSitemap },
      ]}
      output={output}
    />
  );
}

export function XmlSitemapTool() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about");
  const [priority, setPriority] = useState("0.8");
  const [freq, setFreq] = useState("weekly");
  const list = urls.split("\n").map((u) => u.trim()).filter(Boolean);
  const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list
    .map(
      (u) =>
        `  <url>\n    <loc>${u}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>`;
  return (
    <div className="space-y-4">
      <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={8} className="input-field font-mono text-sm" placeholder="One URL per line" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field" placeholder="Priority" />
        <select value={freq} onChange={(e) => setFreq(e.target.value)} className="input-field">
          {["always", "hourly", "daily", "weekly", "monthly", "yearly"].map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
      <KPIStrip items={[{ label: "URLs", value: String(list.length) }]} />
      <CopyResultPanel title="sitemap.xml" text={output} />
    </div>
  );
}

export function OpenGraphTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const output = `<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:url" content="${url}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />`;
  return (
    <div className="space-y-5">
      <GeneratorForm
        fields={[
          { label: "Title", value: title, set: setTitle },
          { label: "Description", value: desc, set: setDesc, multiline: true },
          { label: "Image URL", value: image, set: setImage },
          { label: "Page URL", value: url, set: setUrl },
        ]}
        output={output}
        hideOutput
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-theme-heading">Social card preview</p>
          <OgCardPreview title={title} description={desc} imageUrl={image || undefined} />
        </div>
        <CopyResultPanel title="Meta tags" text={title || desc ? output : ""} />
      </div>
    </div>
  );
}

export function SchemaMarkupTool() {
  const [type, setType] = useState("Article");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [faqQ, setFaqQ] = useState("Is this free?");
  const [faqA, setFaqA] = useState("Yes, this tool is free.");
  const [price, setPrice] = useState("29.00");
  const [currency, setCurrency] = useState("USD");

  const json = useMemo(() => {
    if (type === "FAQPage") {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: faqQ || name,
            acceptedAnswer: { "@type": "Answer", text: faqA || desc },
          },
        ],
      };
    }
    if (type === "Product") {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: desc,
        url,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
        },
      };
    }
    if (type === "Organization") {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        description: desc,
        url,
      };
    }
    return {
      "@context": "https://schema.org",
      "@type": type,
      name,
      headline: name,
      description: desc,
      url,
    };
  }, [type, name, desc, url, faqQ, faqA, price, currency]);

  const output = `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;

  return (
    <div className="space-y-4">
      <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
        {["Article", "Product", "Organization", "FAQPage", "WebPage"].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      {type === "FAQPage" ? (
        <>
          <input value={faqQ} onChange={(e) => setFaqQ(e.target.value)} className="input-field" placeholder="Question" />
          <textarea value={faqA} onChange={(e) => setFaqA(e.target.value)} rows={3} className="input-field" placeholder="Answer" />
        </>
      ) : (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Name / headline" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="input-field" placeholder="Description" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="input-field" placeholder="URL" />
          {type === "Product" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" placeholder="Price" />
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field" placeholder="Currency" />
            </div>
          )}
        </>
      )}
      <CopyResultPanel title="JSON-LD" text={output} />
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
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 text-sm capitalize ${mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted"}`}
          >
            {m}
          </button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="input-field" />
      <CopyResultPanel title="Result" text={text ? output : ""} />
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
      <KPIStrip
        items={[
          { label: "Words", value: String(words), highlight: true },
          { label: "Characters", value: String(chars) },
          { label: "Sentences", value: String(sentences) },
          { label: "Read time", value: `${reading} min` },
        ]}
      />
    </div>
  );
}

export function SlugGeneratorTool() {
  const [text, setText] = useState("");
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return (
    <div className="space-y-4">
      <input value={text} onChange={(e) => setText(e.target.value)} className="input-field" placeholder="Title or phrase" />
      <CopyResultPanel title="Slug" text={slug} />
    </div>
  );
}

function GeneratorForm({
  fields,
  output,
  hideOutput,
}: {
  fields: { label: string; value: string; set: (v: string) => void; multiline?: boolean }[];
  output: string;
  hideOutput?: boolean;
}) {
  return (
    <div className="space-y-4">
      {fields.map((f) =>
        f.multiline ? (
          <div key={f.label}>
            <label className="text-sm text-theme-muted">{f.label}</label>
            <textarea value={f.value} onChange={(e) => f.set(e.target.value)} rows={3} className="input-field mt-1" />
          </div>
        ) : (
          <div key={f.label}>
            <label className="text-sm text-theme-muted">{f.label}</label>
            <input value={f.value} onChange={(e) => f.set(e.target.value)} className="input-field mt-1" />
          </div>
        )
      )}
      {!hideOutput && <CopyResultPanel title="Output" text={output} />}
    </div>
  );
}
