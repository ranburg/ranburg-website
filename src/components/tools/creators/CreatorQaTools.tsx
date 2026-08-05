"use client";

import { useToolUi } from "@/hooks/useToolUi";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import FileDropzone from "@/components/tools/shared/FileDropzone";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";
import { CopyResultPanel } from "@/components/tools/viz/CopyResultPanel";
import {
  loadImageFromFile,
  canvasToBlob,
  downloadBlob,
  formatBytes,
} from "@/lib/imageProcessing";

type VerticalPlatform = "tiktok" | "reels" | "shorts";

const VERTICAL_SAFE_ZONES: Record<
  VerticalPlatform,
  { label: string; top: number; bottom: number; right: number; left: number }
> = {
  tiktok: { label: "TikTok", top: 10, bottom: 22, right: 14, left: 5 },
  reels: { label: "Instagram Reels", top: 12, bottom: 20, right: 12, left: 5 },
  shorts: { label: "YouTube Shorts", top: 11, bottom: 24, right: 13, left: 5 },
};

function ToolShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function drawSafeZoneOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  zones: { top: number; bottom: number; right: number; left: number }
) {
  ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
  const topH = (zones.top / 100) * h;
  const bottomH = (zones.bottom / 100) * h;
  const rightW = (zones.right / 100) * w;
  const leftW = (zones.left / 100) * w;
  ctx.fillRect(0, 0, w, topH);
  ctx.fillRect(0, h - bottomH, w, bottomH);
  ctx.fillRect(w - rightW, topH, rightW, h - topH - bottomH);
  ctx.fillRect(0, topH, leftW, h - topH - bottomH);

  ctx.strokeStyle = "rgba(34, 197, 94, 0.9)";
  ctx.lineWidth = Math.max(2, w / 400);
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(leftW, topH, w - leftW - rightW, h - topH - bottomH);
  ctx.setLineDash([]);
}

export function SafeZoneCheckerTool() {
  const { t } = useToolUi("safe-zone-checker");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [platform, setPlatform] = useState<VerticalPlatform>("tiktok");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("safe-zone-preview");

  const zones = VERTICAL_SAFE_ZONES[platform];

  const render = useCallback(async () => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    drawSafeZoneOverlay(ctx, img.width, img.height, zones);
  }, [img, zones]);

  useEffect(() => {
    render();
  }, [render]);

  const onFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setName(file.name.replace(/\.[^.]+$/, ""));
    const loaded = await loadImageFromFile(file);
    setImg(loaded);
  };

  const downloadPreview = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, `${name}-safe-zone.png`);
  };

  return (
    <ToolShell>
      <FileDropzone accept="image/*" onFiles={onFile} hint="Upload vertical or any image to preview UI safe zones" />
      <div className="flex flex-wrap gap-2">
        {(Object.keys(VERTICAL_SAFE_ZONES) as VerticalPlatform[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${platform === p ? "bg-accent text-white" : "border border-theme text-theme-muted"}`}
          >
            {VERTICAL_SAFE_ZONES[p].label}
          </button>
        ))}
      </div>
      {img && (
        <>
          <KPIStrip
            items={[
              { label: "Dimensions", value: `${img.width} × ${img.height}` },
              { label: "Top danger", value: `${zones.top}%`, hint: "username / status bar" },
              { label: "Bottom danger", value: `${zones.bottom}%`, hint: "captions / CTA" },
              { label: "Right danger", value: `${zones.right}%`, hint: "engagement buttons" },
            ]}
          />
          <div className="glass-card overflow-hidden rounded-xl p-4">
            <canvas ref={canvasRef} className="mx-auto max-h-[480px] w-auto max-w-full rounded-lg" />
            <p className="mt-3 text-center text-xs text-theme-subtle">
              Red overlays mark approximate UI danger zones. Green dashed box is the safe content area.
            </p>
            <div className="mt-4 flex justify-center">
              <button type="button" onClick={downloadPreview} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
                <Download className="mr-2 inline h-4 w-4" />
                Download annotated preview
              </button>
            </div>
          </div>
        </>
      )}
    </ToolShell>
  );
}

type CheckStatus = "pass" | "warn" | "fail";

function StatusBadge({ status, text }: { status: CheckStatus; text: string }) {
  const colors = {
    pass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-600",
    fail: "border-red-500/40 bg-red-500/10 text-red-600",
  };
  return (
    <li className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${colors[status]}`}>
      <span className="font-semibold uppercase">{status}</span>
      <span className="text-theme-muted">{text}</span>
    </li>
  );
}

export function YoutubeThumbnailCheckerTool() {
  const { t } = useToolUi("youtube-thumbnail-checker");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const checks = useMemo(() => {
    if (!file || !img) return [];
    const ratio = img.width / img.height;
  const target = 16 / 9;
    const ratioDiff = Math.abs(ratio - target);
    const items: { status: CheckStatus; text: string }[] = [];

    if (ratioDiff < 0.02) items.push({ status: "pass", text: `Aspect ratio is 16:9 (${ratio.toFixed(3)})` });
    else if (ratioDiff < 0.08) items.push({ status: "warn", text: `Aspect ratio ${ratio.toFixed(3)} — close to 16:9 but not exact` });
    else items.push({ status: "fail", text: `Aspect ratio ${ratio.toFixed(3)} — YouTube expects 16:9` });

    if (img.width >= 1280 && img.height >= 720)
      items.push({ status: "pass", text: `Resolution ${img.width}×${img.height} meets recommended 1280×720` });
    else if (img.width >= 640)
      items.push({ status: "warn", text: `Width ${img.width}px meets minimum 640 but 1280×720 is recommended` });
    else items.push({ status: "fail", text: `Width ${img.width}px is below 640px minimum` });

    if (file.size <= 2 * 1024 * 1024)
      items.push({ status: "pass", text: `File size ${formatBytes(file.size)} is under 2 MB limit` });
    else items.push({ status: "fail", text: `File size ${formatBytes(file.size)} exceeds 2 MB limit` });

    items.push({
      status: "pass",
      text: "Safe zone overlay shows center title area — avoid bottom-right duration badge region",
    });

    return items;
  }, [file, img]);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const padX = img.width * 0.1;
    const padY = img.height * 0.1;
    ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
    ctx.fillRect(img.width * 0.72, img.height * 0.72, img.width * 0.28, img.height * 0.28);
    ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
    ctx.lineWidth = Math.max(2, img.width / 500);
    ctx.setLineDash([10, 6]);
    ctx.strokeRect(padX, padY, img.width - padX * 2, img.height - padY * 2);
    ctx.setLineDash([]);
  }, [img]);

  const onFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setImg(await loadImageFromFile(f));
  };

  const passCount = checks.filter((c) => c.status === "pass").length;

  return (
    <ToolShell>
      <FileDropzone accept="image/*" onFiles={onFile} hint="Upload a YouTube thumbnail (JPG, PNG, or WebP)" />
      {img && file && (
        <>
          <KPIStrip
            items={[
              { label: "Resolution", value: `${img.width}×${img.height}`, highlight: true },
              { label: "File size", value: formatBytes(file.size) },
              { label: "Checks passed", value: `${passCount}/${checks.length}` },
            ]}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card rounded-xl p-4">
              <canvas ref={canvasRef} className="mx-auto max-h-64 w-full rounded-lg object-contain" />
              <p className="mt-2 text-xs text-theme-subtle">Green box = title safe area. Red corner = duration badge zone.</p>
            </div>
            <ul className="space-y-2">
              {checks.map((c, i) => (
                <StatusBadge key={i} status={c.status} text={c.text} />
              ))}
            </ul>
          </div>
        </>
      )}
    </ToolShell>
  );
}

const PLATFORM_SPECS = [
  { name: "Instagram Feed", w: 1080, h: 1350, ratio: 4 / 5 },
  { name: "Stories / Reels / TikTok / Shorts", w: 1080, h: 1920, ratio: 9 / 16 },
  { name: "YouTube Thumbnail", w: 1280, h: 720, ratio: 16 / 9 },
  { name: "LinkedIn Post", w: 1200, h: 627, ratio: 1200 / 627 },
  { name: "X (Twitter) Post", w: 1600, h: 900, ratio: 16 / 9 },
  { name: "Pinterest Pin", w: 1000, h: 1500, ratio: 2 / 3 },
] as const;

export function SocialImageSizeFitTool() {
  const { t } = useToolUi("social-image-size-checker");
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const fits = useMemo(() => {
    if (!img) return [];
    const ratio = img.width / img.height;
    return PLATFORM_SPECS.map((p) => {
      const ratioDiff = Math.abs(ratio - p.ratio) / p.ratio;
      const scaleW = p.w / img.width;
      const scaleH = p.h / img.height;
      const coverScale = Math.max(scaleW, scaleH);
      const cropPct = coverScale > 1 ? 0 : (1 - Math.min(scaleW, scaleH) / coverScale) * 100;
      let status: CheckStatus = "fail";
      if (ratioDiff < 0.03 && img.width >= p.w * 0.9 && img.height >= p.h * 0.9) status = "pass";
      else if (ratioDiff < 0.08 || (img.width >= p.w * 0.7 && img.height >= p.h * 0.7)) status = "warn";
      return { ...p, status, ratioDiff, cropPct };
    });
  }, [img]);

  const onFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setImg(await loadImageFromFile(f));
  };

  return (
    <ToolShell>
      <FileDropzone accept="image/*" onFiles={onFile} hint="See which social platforms your image dimensions fit" />
      {img && (
        <>
          <KPIStrip
            items={[
              { label: "Your image", value: `${img.width}×${img.height}`, highlight: true },
              { label: "Aspect ratio", value: (img.width / img.height).toFixed(3) },
              { label: "Platforms fit", value: `${fits.filter((f) => f.status === "pass").length} pass` },
            ]}
          />
          <div className="overflow-x-auto rounded-xl border border-theme">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-theme bg-theme-surface/60 text-left text-xs uppercase text-theme-subtle">
                  <th className="p-3">Platform</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Fit</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {fits.map((f) => (
                  <tr key={f.name} className="border-b border-theme/60">
                    <td className="p-3 font-medium text-theme-heading">{f.name}</td>
                    <td className="p-3 font-mono text-theme-muted">{f.w}×{f.h}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                          f.status === "pass"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : f.status === "warn"
                              ? "bg-amber-500/15 text-amber-600"
                              : "bg-red-500/15 text-red-600"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3 text-theme-muted">
                      {f.status === "pass"
                        ? "Dimensions and ratio match well"
                        : f.status === "warn"
                          ? "Usable with minor crop or upscale"
                          : "Resize or crop recommended"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ToolShell>
  );
}

export function CompressToExactSizeTool() {
  const { t } = useToolUi("compress-to-exact-size");
  const [targetKb, setTargetKb] = useState(200);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [actualKb, setActualKb] = useState(0);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("compressed");

  const compress = useCallback(async (image: HTMLImageElement, targetBytes: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(image, 0, 0);

    let lo = 0.05;
    let hi = 0.98;
    let best: Blob | null = null;

    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      const out = await canvasToBlob(canvas, "image/jpeg", mid);
      if (out.size <= targetBytes) {
        best = out;
        lo = mid;
      } else {
        hi = mid;
      }
    }

    if (!best) best = await canvasToBlob(canvas, "image/jpeg", lo);
    return best;
  }, []);

  const onFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setName(f.name.replace(/\.[^.]+$/, ""));
    const loaded = await loadImageFromFile(f);
    setImg(loaded);
    setBusy(true);
    try {
      const out = await compress(loaded, targetKb * 1024);
      setBlob(out);
      setActualKb(Math.round(out.size / 1024));
    } finally {
      setBusy(false);
    }
  };

  const recompress = async () => {
    if (!img) return;
    setBusy(true);
    try {
      const out = await compress(img, targetKb * 1024);
      setBlob(out);
      setActualKb(Math.round(out.size / 1024));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell>
      <FileDropzone accept="image/*" onFiles={onFile} hint="Binary-search JPEG quality to hit your target file size" />
      <CalculatorSlider label="Target size" value={targetKb} min={20} max={2000} step={10} unit=" KB" onChange={setTargetKb} />
      {img && (
        <>
          <KPIStrip
            items={[
              { label: "Target", value: `${targetKb} KB`, highlight: true },
              { label: "Actual", value: busy ? "…" : `${actualKb} KB` },
              { label: "Source", value: `${img.width}×${img.height}` },
            ]}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={recompress} disabled={busy} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              Re-compress to target
            </button>
            {blob && (
              <button type="button" onClick={() => downloadBlob(blob, `${name}-${targetKb}kb.jpg`)} className="rounded-xl border border-theme px-6 py-2.5 text-sm font-semibold text-theme-heading">
                <Download className="mr-2 inline h-4 w-4" />
                Download JPEG
              </button>
            )}
          </div>
        </>
      )}
    </ToolShell>
  );
}

function buildChapters(input: string): string {
  const lines = input.split("\n").filter((l) => l.trim());
  const chapters: string[] = [];
  for (const line of lines) {
    const m = line.trim().match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/);
    if (m) chapters.push(`${m[1]} ${m[2].trim()}`);
  }
  if (chapters.length === 0) return "";
  if (!/^0:00/.test(chapters[0])) chapters.unshift("0:00 Intro");
  return chapters.join("\n");
}

export function YoutubeChapterGeneratorTool() {
  const { t } = useToolUi("youtube-chapter-generator");
  const [input, setInput] = useState("0:00 Intro\n1:30 Main topic\n5:45 Demo\n8:00 Outro");
  const output = useMemo(() => buildChapters(input), [input]);
  const lineCount = output ? output.split("\n").length : 0;

  return (
    <ToolShell>
      <div>
        <label className="text-sm font-medium text-theme-muted">Chapter lines (timestamp + title per line)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="input-field mt-2 font-mono text-sm"
          placeholder={"0:00 Intro\n1:30 Topic name"}
        />
      </div>
      <KPIStrip items={[{ label: "Chapters", value: `${lineCount}`, highlight: true }]} />
      <CopyResultPanel title="YouTube chapters block" text={output} emptyHint="Add timestamp lines like 0:00 Intro" />
      <p className="text-xs text-theme-subtle">
        Paste into your video description. YouTube requires the first chapter at 0:00 and at least three timestamps spaced 10+ seconds apart.
      </p>
    </ToolShell>
  );
}
