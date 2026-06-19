"use client";

import { useState } from "react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

type CodeType = "html" | "css" | "js";

function minifyHTML(code: string, preserveComments: boolean): string {
  let result = code;
  if (!preserveComments) result = result.replace(/<!--[\s\S]*?-->/g, "");
  return result.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
}

function minifyCSS(code: string, preserveComments: boolean): string {
  let result = code;
  if (!preserveComments) result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  return result.replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
}

function minifyJS(code: string, preserveComments: boolean): string {
  let result = code;
  if (!preserveComments) {
    result = result.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  }
  return result.replace(/\s+/g, " ").trim();
}

export default function MinifierTool() {
  const [codeType, setCodeType] = useState<CodeType>("html");
  const [input, setInput] = useState("<div class=\"container\">\n  <p>Hello World</p>\n</div>");
  const [output, setOutput] = useState("");
  const [preserveComments, setPreserveComments] = useState(false);

  const handleMinify = () => {
    const fns = { html: minifyHTML, css: minifyCSS, js: minifyJS };
    setOutput(fns[codeType](input, preserveComments));
  };

  const reduction = input.length > 0 && output.length > 0
    ? Math.round((1 - output.length / input.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["html", "css", "js"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setCodeType(type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all",
              codeType === type ? "bg-accent text-white" : "bg-white/[0.05] text-slate-400 hover:text-white"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">Source Code</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="input-field font-mono text-sm" spellCheck={false} />
          <p className="mt-2 text-xs text-slate-500">{input.length} characters</p>
        </div>
        <div className="glass-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Minified Output</label>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly rows={14} className="input-field font-mono text-sm text-accent-emerald" />
          {output && (
            <p className="mt-2 text-xs text-accent-emerald">
              {output.length} chars — {reduction}% size reduction
            </p>
          )}
        </div>
      </div>

      <button type="button" onClick={handleMinify} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
        Minify {codeType.toUpperCase()}
      </button>

      <div className="glass-card p-6">
        <AdvancedOptions>
          <label className="flex items-center gap-3 text-sm text-slate-400">
            <input type="checkbox" checked={preserveComments} onChange={(e) => setPreserveComments(e.target.checked)} className="accent-accent" />
            Preserve comments
          </label>
        </AdvancedOptions>
      </div>
    </div>
  );
}
