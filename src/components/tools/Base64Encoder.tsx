"use client";

import { useState } from "react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

function encodeText(text: string, urlSafe: boolean): string {
  const encoded = btoa(unescape(encodeURIComponent(text)));
  return urlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
}

function decodeText(b64: string, urlSafe: boolean): string {
  let input = b64.trim();
  if (urlSafe) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    while (input.length % 4) input += "=";
  }
  return decodeURIComponent(escape(atob(input)));
}

export default function Base64Encoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, Ranburg!");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [lineWrap, setLineWrap] = useState(76);

  const process = () => {
    setError("");
    try {
      if (mode === "encode") {
        let result = encodeText(input, urlSafe);
        if (lineWrap > 0) result = result.replace(new RegExp(`(.{1,${lineWrap}})`, "g"), "$1\n").trim();
        setOutput(result);
      } else {
        setOutput(decodeText(input, urlSafe));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid Base64");
      setOutput("");
    }
  };

  const handleFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const encoded = btoa(binary);
    setInput(encoded);
    setMode("decode");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium capitalize transition",
              mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-theme-heading"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-theme-body">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="input-field font-mono text-sm" spellCheck={false} />
          <label htmlFor="base64-file" className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
            <input type="file" className="sr-only" id="base64-file" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <span className="rounded-lg border border-theme-subtle px-3 py-1.5 hover:border-accent/40">Upload file to encode</span>
          </label>
        </div>
        <div className="glass-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-theme-body">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly rows={12} className="input-field font-mono text-sm text-accent-emerald" placeholder="Click Process to see output…" />
        </div>
      </div>

      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <button type="button" onClick={process} className="rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent/90">
        {mode === "encode" ? "Encode" : "Decode"}
      </button>

      <AdvancedOptions>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="accent-accent" />
            URL-safe Base64
          </label>
          {mode === "encode" && (
            <div>
              <label className="mb-2 block text-sm text-theme-muted">Line wrap (0 = none)</label>
              <input type="number" min={0} max={200} value={lineWrap} onChange={(e) => setLineWrap(Number(e.target.value))} className="input-field" />
            </div>
          )}
        </div>
      </AdvancedOptions>
    </div>
  );
}
