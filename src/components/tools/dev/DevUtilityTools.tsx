"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

type DiffKind = "same" | "add" | "del";
interface DiffLine {
  kind: DiffKind;
  text: string;
}

function lcsDiff(aLines: string[], bLines: string[]): DiffLine[] {
  const n = aLines.length;
  const m = bLines.length;
  const cap = 4000;
  const A = aLines.slice(0, cap);
  const B = bLines.slice(0, cap);
  const dp: number[][] = Array.from({ length: A.length + 1 }, () => Array(B.length + 1).fill(0));
  for (let i = A.length - 1; i >= 0; i--) {
    for (let j = B.length - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < A.length && j < B.length) {
    if (A[i] === B[j]) {
      out.push({ kind: "same", text: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ kind: "del", text: A[i] });
      i++;
    } else {
      out.push({ kind: "add", text: B[j] });
      j++;
    }
  }
  while (i < A.length) out.push({ kind: "del", text: A[i++] });
  while (j < B.length) out.push({ kind: "add", text: B[j++] });
  if (n > cap || m > cap) {
    out.push({ kind: "same", text: `… truncated after ${cap} lines for performance` });
  }
  return out;
}

export function TextDiffCheckerTool() {
  const [left, setLeft] = useState("function greet() {\n  return 'hello';\n}\n");
  const [right, setRight] = useState("function greet(name) {\n  return `hello ${name}`;\n}\n");
  const [mode, setMode] = useState<"split" | "inline">("split");

  const lines = useMemo(() => lcsDiff(left.split("\n"), right.split("\n")), [left, right]);
  const added = lines.filter((l) => l.kind === "add").length;
  const removed = lines.filter((l) => l.kind === "del").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["split", "inline"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${
                mode === m ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted"
              }`}
            >
              {m === "split" ? "Side by side" : "Inline"}
            </button>
          ))}
        </div>
        <p className="text-sm text-theme-muted">
          <span className="font-semibold text-accent-emerald">+{added}</span>
          {" · "}
          <span className="font-semibold text-red-400">−{removed}</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-4">
          <label className="mb-2 block text-sm font-medium text-theme-body">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            rows={12}
            className="input-field font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="glass-card p-4">
          <label className="mb-2 block text-sm font-medium text-theme-body">Revised</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            rows={12}
            className="input-field font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {mode === "inline" ? (
        <pre className="glass-card max-h-[32rem] overflow-auto p-4 font-mono text-xs leading-6">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.kind === "add"
                  ? "bg-emerald-500/15 text-accent-emerald"
                  : line.kind === "del"
                    ? "bg-red-500/15 text-red-400"
                    : "text-theme-muted"
              }
            >
              <span className="inline-block w-6 select-none opacity-60">
                {line.kind === "add" ? "+" : line.kind === "del" ? "−" : " "}
              </span>
              {line.text || " "}
            </div>
          ))}
        </pre>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <pre className="glass-card max-h-[28rem] overflow-auto p-4 font-mono text-xs leading-6">
            {lines
              .filter((l) => l.kind !== "add")
              .map((line, i) => (
                <div key={i} className={line.kind === "del" ? "bg-red-500/15 text-red-400" : "text-theme-muted"}>
                  {line.text || " "}
                </div>
              ))}
          </pre>
          <pre className="glass-card max-h-[28rem] overflow-auto p-4 font-mono text-xs leading-6">
            {lines
              .filter((l) => l.kind !== "del")
              .map((line, i) => (
                <div
                  key={i}
                  className={line.kind === "add" ? "bg-emerald-500/15 text-accent-emerald" : "text-theme-muted"}
                >
                  {line.text || " "}
                </div>
              ))}
          </pre>
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderInline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return s;
}

export function markdownToHtml(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeLang = "";
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const fence = raw.match(/^```(\w+)?$/);
    if (fence) {
      closeList();
      if (inCode) {
        html.push("</code></pre>");
        inCode = false;
      } else {
        inCode = true;
        codeLang = fence[1] ?? "";
        html.push(`<pre><code class="language-${escapeHtml(codeLang)}">`);
      }
      continue;
    }
    if (inCode) {
      html.push(`${escapeHtml(raw)}\n`);
      continue;
    }
    if (!raw.trim()) {
      closeList();
      continue;
    }
    const heading = raw.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }
    if (/^>\s?/.test(raw)) {
      closeList();
      html.push(`<blockquote>${renderInline(raw.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }
    const ul = raw.match(/^[-*]\s+(.*)$/);
    if (ul) {
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${renderInline(ul[1])}</li>`);
      continue;
    }
    const ol = raw.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${renderInline(ol[1])}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${renderInline(raw)}</p>`);
  }
  closeList();
  if (inCode) html.push("</code></pre>");
  return html.join("\n");
}

const SAMPLE_MD = `# Markdown preview

Write **bold**, *italic*, and \`inline code\`.

- Lists work
- So do [links](https://www.ranburg.com)

\`\`\`js
console.log("hello");
\`\`\`
`;

export function MarkdownPreviewTool() {
  const [src, setSrc] = useState(SAMPLE_MD);
  const html = useMemo(() => markdownToHtml(src), [src]);
  const words = src.trim() ? src.trim().split(/\s+/).length : 0;
  const chars = src.length;

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
  };

  const downloadHtml = () => {
    const blob = new Blob(
      [`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Markdown</title></head><body>${html}</body></html>`],
      { type: "text/html" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "preview.html";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-theme-muted">
        <p>
          {words} words · {chars} characters
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={copyHtml} className="rounded-lg border border-theme-subtle px-3 py-1.5 text-sm font-semibold text-theme-heading">
            Copy HTML
          </button>
          <button type="button" onClick={downloadHtml} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white">
            Download HTML
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-4">
          <label className="mb-2 block text-sm font-medium text-theme-body">Markdown</label>
          <textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            rows={18}
            className="input-field font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="glass-card prose-tool max-h-[32rem] overflow-auto p-6">
          <div
            className="space-y-3 text-sm leading-relaxed text-theme-body [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-3 [&_blockquote]:text-theme-muted [&_code]:rounded [&_code]:bg-theme-surface [&_code]:px-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-theme-surface [&_pre]:p-3 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <CopyButton text={html} />
    </div>
  );
}
