"use client";

import { useState, useRef } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";

export default function ImageConverter() {
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState<"webp" | "base64">("base64");
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/webp", quality / 100);
        setPreview(dataUrl);
        setOutput(format === "base64" ? dataUrl : dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadWebP = () => {
    if (!output) return;
    const a = document.createElement("a");
    a.href = output;
    a.download = fileName.replace(/\.[^.]+$/, ".webp") || "converted.webp";
    a.click();
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="glass-card p-8 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
          className="block w-full cursor-pointer text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        <p className="mt-3 text-xs text-slate-500">PNG, JPG, GIF, WebP — processed locally in your browser</p>
      </div>

      <div className="flex gap-2">
        {(["base64", "webp"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all ${
              format === f ? "bg-accent text-white" : "bg-white/[0.05] text-slate-400"
            }`}
          >
            {f === "base64" ? "Base64 String" : "WebP Download"}
          </button>
        ))}
      </div>

      <AdvancedOptions>
        <CalculatorSlider label="WebP Quality" value={quality} min={10} max={100} step={5} unit="%" onChange={setQuality} />
        <CalculatorSlider label="Max Width" value={maxWidth} min={200} max={4000} step={100} unit="px" onChange={setMaxWidth} />
      </AdvancedOptions>

      {preview && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-6">
            <p className="mb-3 text-sm font-medium text-slate-300">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
          </div>
          <div className="glass-card p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">Output</p>
              <div className="flex gap-2">
                <CopyButton text={output} />
                {format === "webp" && (
                  <button type="button" onClick={downloadWebP} className="rounded-lg bg-accent-emerald/20 px-4 py-2 text-sm font-medium text-accent-emerald">
                    Download WebP
                  </button>
                )}
              </div>
            </div>
            <textarea value={output} readOnly rows={8} className="input-field font-mono text-xs" />
          </div>
        </div>
      )}
    </div>
  );
}
