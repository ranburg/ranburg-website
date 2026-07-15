"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import FileDropzone from "@/components/tools/shared/FileDropzone";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import { BeforeAfterBar } from "@/components/tools/viz";
import {
  loadImageFromFile,
  drawToCanvas,
  canvasToBlob,
  downloadBlob,
} from "@/lib/imageProcessing";

export function ImageCompressorTool() {
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [sizes, setSizes] = useState({ before: 0, after: 0 });
  const [blob, setBlob] = useState<Blob | null>(null);
  const [name, setName] = useState("compressed");

  const process = async (file: File) => {
    setSizes({ before: file.size, after: 0 });
    setName(file.name.replace(/\.[^.]+$/, ""));
    const img = await loadImageFromFile(file);
    const scale = Math.min(1, maxWidth / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = drawToCanvas(img, w, h);
    const mime = file.type.startsWith("image/png") ? "image/png" : "image/jpeg";
    const out = await canvasToBlob(canvas, mime, quality / 100);
    setBlob(out);
    setSizes((s) => ({ ...s, after: out.size }));
    setPreview(URL.createObjectURL(out));
  };

  return (
    <ToolLayout
      onFile={process}
      preview={preview}
      sizes={sizes}
      blob={blob}
      filename={`${name}.jpg`}
      extra={
        <AdvancedOptions>
          <CalculatorSlider label="Quality" value={quality} min={10} max={100} step={5} unit="%" onChange={setQuality} />
          <CalculatorSlider label="Max width" value={maxWidth} min={400} max={4000} step={100} unit="px" onChange={setMaxWidth} />
        </AdvancedOptions>
      }
    />
  );
}

export function ImageResizerTool() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [name, setName] = useState("resized");
  const ratioRef = { current: 1 };

  const process = async (file: File) => {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const img = await loadImageFromFile(file);
    ratioRef.current = img.width / img.height;
    let w = width;
    let h = height;
    if (keepRatio) h = Math.round(w / ratioRef.current);
    const canvas = drawToCanvas(img, w, h);
    const out = await canvasToBlob(canvas, "image/png");
    setBlob(out);
    setPreview(URL.createObjectURL(out));
  };

  return (
    <div className="space-y-6">
      <FileDropzone accept="image/*" onFiles={(f) => f[0] && process(f[0])} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm text-theme-muted">Width (px)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Height (px)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="input-field mt-1" disabled={keepRatio} />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-theme-muted">
          <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
          Keep aspect ratio
        </label>
      </div>
      {preview && blob && (
        <div className="glass-card p-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Resized" className="mx-auto max-h-64 rounded-lg" />
          <button type="button" onClick={() => downloadBlob(blob, `${name}.png`)} className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
            <Download className="mr-2 inline h-4 w-4" />Download
          </button>
        </div>
      )}
    </div>
  );
}

export function CropImageTool() {
  const [srcPreview, setSrcPreview] = useState<string | null>(null);
  const [outPreview, setOutPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 10, y: 10, w: 60, h: 60 }); // % of displayed box
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("cropped");
  const [dragging, setDragging] = useState<"move" | "br" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, crop: crop });

  const process = async (file: File) => {
    setName(file.name.replace(/\.[^.]+$/, ""));
    setBlob(null);
    setOutPreview(null);
    const img = await loadImageFromFile(file);
    setImgEl(img);
    setNatural({ w: img.width, h: img.height });
    setSrcPreview(img.src);
    setCrop({ x: 10, y: 10, w: 60, h: 60 });
  };

  const onPointerDown = (mode: "move" | "br", e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(mode);
    setDragStart({ x: e.clientX, y: e.clientY, crop: { ...crop } });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const box = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / box.width) * 100;
    const dy = ((e.clientY - dragStart.y) / box.height) * 100;
    if (dragging === "move") {
      setCrop({
        ...dragStart.crop,
        x: Math.min(Math.max(dragStart.crop.x + dx, 0), 100 - dragStart.crop.w),
        y: Math.min(Math.max(dragStart.crop.y + dy, 0), 100 - dragStart.crop.h),
      });
    } else {
      setCrop({
        ...dragStart.crop,
        w: Math.min(Math.max(dragStart.crop.w + dx, 8), 100 - dragStart.crop.x),
        h: Math.min(Math.max(dragStart.crop.h + dy, 8), 100 - dragStart.crop.y),
      });
    }
  };

  const applyCrop = async () => {
    if (!imgEl || !natural.w) return;
    const sx = Math.round((crop.x / 100) * natural.w);
    const sy = Math.round((crop.y / 100) * natural.h);
    const sw = Math.round((crop.w / 100) * natural.w);
    const sh = Math.round((crop.h / 100) * natural.h);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(sw, 1);
    canvas.height = Math.max(sh, 1);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, sw, sh);
    const out = await canvasToBlob(canvas, "image/png");
    setBlob(out);
    setOutPreview(URL.createObjectURL(out));
  };

  return (
    <div className="space-y-6">
      <FileDropzone accept="image/*" onFiles={(f) => f[0] && process(f[0])} />
      {srcPreview && (
        <>
          <div
            className="relative mx-auto max-w-xl select-none overflow-hidden rounded-xl border border-theme-subtle"
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={srcPreview} alt="Source" className="block w-full" draggable={false} />
            <div className="pointer-events-none absolute inset-0 bg-black/40" />
            <div
              className="absolute cursor-move border-2 border-accent bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
              style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.w}%`, height: `${crop.h}%`, pointerEvents: "auto" }}
              onPointerDown={(e) => onPointerDown("move", e)}
            >
              <div
                className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm bg-accent"
                onPointerDown={(e) => onPointerDown("br", e)}
              />
            </div>
          </div>
          <p className="text-center text-xs text-theme-subtle">Drag the frame to move · drag the corner to resize</p>
          <button type="button" onClick={applyCrop} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
            Apply crop
          </button>
          {blob && outPreview && (
            <div className="rounded-xl border border-theme-subtle p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outPreview} alt="Cropped" className="mx-auto max-h-64 rounded-lg" />
              <button
                type="button"
                onClick={() => downloadBlob(blob, `${name}.png`)}
                className="mt-4 rounded-xl bg-accent-emerald px-6 py-2.5 text-sm font-semibold text-white"
              >
                Download PNG
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ImageToBase64Tool() {
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const process = async (file: File) => {
    const img = await loadImageFromFile(file);
    const canvas = drawToCanvas(img, img.width, img.height);
    const data = canvas.toDataURL(file.type || "image/png");
    setOutput(data);
    setPreview(data);
  };

  return (
    <div className="space-y-6">
      <FileDropzone accept="image/*" onFiles={(f) => f[0] && process(f[0])} />
      {output && (
        <div className="grid gap-6 lg:grid-cols-2">
          {preview && (
            <div className="glass-card p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
            </div>
          )}
          <textarea value={output} readOnly rows={10} className="input-field font-mono text-xs" />
        </div>
      )}
    </div>
  );
}

export function Base64ToImageTool() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    setError("");
    try {
      const src = input.trim().startsWith("data:") ? input.trim() : `data:image/png;base64,${input.trim()}`;
      setPreview(src);
    } catch {
      setError("Invalid Base64 string.");
    }
  };

  const download = async () => {
    if (!preview) return;
    const res = await fetch(preview);
    const blob = await res.blob();
    downloadBlob(blob, "decoded.png");
  };

  return (
    <div className="space-y-6">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="input-field font-mono text-xs" placeholder="Paste Base64 or data:image/... URL" />
      <button type="button" onClick={decode} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Decode</button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {preview && (
        <div className="glass-card p-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Decoded" className="mx-auto max-h-64 rounded-lg" />
          <button type="button" onClick={download} className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Download PNG</button>
        </div>
      )}
    </div>
  );
}

export function RemoveExifTool() {
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [sizes, setSizes] = useState({ before: 0, after: 0 });
  const [name, setName] = useState("clean");

  const process = async (file: File) => {
    setName(file.name.replace(/\.[^.]+$/, ""));
    setSizes({ before: file.size, after: 0 });
    // Re-encode via canvas — strips EXIF/ICC that browsers don't paint into the bitmap
    const img = await loadImageFromFile(file);
    const canvas = drawToCanvas(img, img.width, img.height);
    const mime = file.type.includes("png") ? "image/png" : "image/jpeg";
    const out = await canvasToBlob(canvas, mime, 0.92);
    setBlob(out);
    setSizes((s) => ({ ...s, after: out.size }));
    setPreview(URL.createObjectURL(out));
  };

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-theme-muted">
        Re-encodes your photo in the browser to strip most EXIF / location metadata. Preview looks the same — the file is cleaned.
      </p>
      <FileDropzone accept="image/*" onFiles={(f) => f[0] && process(f[0])} />
      {preview && blob && (
        <div className="space-y-4">
          <BeforeAfterBar before={sizes.before} after={sizes.after} />
          <div className="rounded-xl border border-theme-subtle p-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Cleaned" className="mx-auto max-h-64 rounded-lg" />
            <button
              type="button"
              onClick={() => downloadBlob(blob, `${name}-clean.jpg`)}
              className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white"
            >
              Download cleaned image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function HeicToJpgTool() {
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const process = async (file: File) => {
    setStatus("Converting…");
    try {
      const heic2any = (await import("heic2any")).default;
      const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
      const out = Array.isArray(result) ? result[0] : result;
      setBlob(out);
      setPreview(URL.createObjectURL(out));
      setStatus("");
    } catch {
      setStatus("HEIC conversion failed. Try Safari or export as JPG from Photos.");
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone accept=".heic,.heif,image/heic" onFiles={(f) => f[0] && process(f[0])} hint="iPhone HEIC photos supported" />
      {status && <p className="text-sm text-theme-muted">{status}</p>}
      {preview && blob && (
        <div className="glass-card p-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Converted" className="mx-auto max-h-64 rounded-lg" />
          <button type="button" onClick={() => downloadBlob(blob, "converted.jpg")} className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Download JPG</button>
        </div>
      )}
    </div>
  );
}

export function SvgToPngTool() {
  const [width, setWidth] = useState(512);
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const processFile = async (file: File) => {
    const text = await file.text();
    await rasterize(text);
  };

  const rasterize = async (svgText: string) => {
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = rej;
      img.src = url;
    });
    const h = Math.round((width / img.width) * img.height) || width;
    const canvas = drawToCanvas(img, width, h);
    const out = await canvasToBlob(canvas, "image/png");
    setBlob(out);
    setPreview(URL.createObjectURL(out));
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FileDropzone accept=".svg,image/svg+xml" onFiles={(f) => f[0] && processFile(f[0])} />
      <div>
        <label className="text-sm text-theme-muted">Output width (px)</label>
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="input-field mt-1 max-w-xs" />
      </div>
      <textarea rows={4} className="input-field font-mono text-xs" placeholder="Or paste SVG markup here" onBlur={(e) => e.target.value && rasterize(e.target.value)} />
      {preview && blob && (
        <div className="glass-card p-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="PNG" className="mx-auto max-h-64 rounded-lg" />
          <button type="button" onClick={() => downloadBlob(blob, "converted.png")} className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">Download PNG</button>
        </div>
      )}
    </div>
  );
}

function ToolLayout({
  onFile,
  preview,
  sizes,
  blob,
  filename,
  extra,
}: {
  onFile: (f: File) => void;
  preview: string | null;
  sizes: { before: number; after: number };
  blob: Blob | null;
  filename: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <FileDropzone accept="image/*" onFiles={(f) => f[0] && onFile(f[0])} />
      {extra}
      {preview && blob && (
        <div className="glass-card space-y-4 p-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Output" className="mx-auto max-h-64 rounded-lg" />
          {sizes.after > 0 && <BeforeAfterBar before={sizes.before} after={sizes.after} />}
          <button type="button" onClick={() => downloadBlob(blob, filename)} className="mt-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
            <Download className="mr-2 inline h-4 w-4" />Download
          </button>
        </div>
      )}
    </div>
  );
}
