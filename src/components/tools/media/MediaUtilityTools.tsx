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

function ToolShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

async function loadAvifImage(file: File): Promise<HTMLImageElement> {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const dataUrl = canvas.toDataURL("image/png");
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  } catch {
    return loadImageFromFile(file);
  }
}

function canEncodeAvif(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const data = canvas.toDataURL("image/avif");
  return data.startsWith("data:image/avif");
}

export function AvifToJpgTool() {
  const { t } = useToolUi("avif-to-jpg");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);

  const convert = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setNote(null);
    try {
      const img = await loadAvifImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/jpeg", quality / 100);
      const base = file.name.replace(/\.[^.]+$/, "");
      downloadBlob(blob, `${base}.jpg`);
      setNote(`Converted ${img.width}×${img.height} AVIF to JPEG (${formatBytes(blob.size)}).`);
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell>
      <FileDropzone accept=".avif,image/avif" onFiles={convert} hint="Decode AVIF in your browser and export as JPEG" />
      <CalculatorSlider label="JPEG quality" value={quality} min={50} max={100} step={5} unit="%" onChange={setQuality} />
      {busy && <p className="text-sm text-theme-muted">Converting…</p>}
      {note && <p className="rounded-lg border border-theme-subtle bg-theme-surface/50 p-3 text-sm text-theme-muted">{note}</p>}
    </ToolShell>
  );
}

export function JpgToAvifTool() {
  const { t } = useToolUi("jpg-to-avif");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const encodeOk = useMemo(() => (typeof window !== "undefined" ? canEncodeAvif() : false), []);

  const convert = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setNote(null);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);

      if (encodeOk) {
        const out = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("AVIF export failed"))),
            "image/avif",
            0.8
          );
        });
        downloadBlob(out, `${file.name.replace(/\.[^.]+$/, "")}.avif`);
        setNote(`Encoded AVIF via browser (${formatBytes(out.size)}).`);
      } else {
        const blob = await canvasToBlob(canvas, "image/png");
        downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}.png`);
        setNote(
          "Your browser cannot encode AVIF. Exported PNG instead. AVIF encoding requires Chrome 93+ or similar — or use a server-side converter."
        );
      }
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell>
      <FileDropzone accept="image/jpeg,.jpg,.jpeg" onFiles={convert} hint="Convert JPEG to AVIF when your browser supports encoding" />
      {!encodeOk && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700">
          AVIF encoding is not available in this browser. Upload will produce a PNG fallback with a clear notice.
        </p>
      )}
      {busy && <p className="text-sm text-theme-muted">Converting…</p>}
      {note && <p className="rounded-lg border border-theme-subtle bg-theme-surface/50 p-3 text-sm text-theme-muted">{note}</p>}
    </ToolShell>
  );
}

export function OpusToMp3Tool() {
  const { t } = useToolUi("opus-to-mp3");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "missing" | "converting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const ffmpegRef = useRef<{ ffmpeg: { load: (opts: object) => Promise<void>; writeFile: (n: string, d: Uint8Array) => Promise<void>; exec: (a: string[]) => Promise<void>; readFile: (n: string) => Promise<Uint8Array> }; fetchFile: (f: File) => Promise<Uint8Array> } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const [ffmpegMod, utilMod] = await Promise.all([
          import("@ffmpeg/ffmpeg"),
          import("@ffmpeg/util"),
        ]);
        if (cancelled) return;
        const ffmpeg = new ffmpegMod.FFmpeg();
        const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
        await ffmpeg.load({
          coreURL: await utilMod.toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await utilMod.toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });
        ffmpegRef.current = { ffmpeg, fetchFile: utilMod.fetchFile };
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("missing");
          setMessage("Install @ffmpeg/ffmpeg and @ffmpeg/util: npm install @ffmpeg/ffmpeg @ffmpeg/util");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const convert = async (files: File[]) => {
    const file = files[0];
    if (!file || !ffmpegRef.current) return;
    setStatus("converting");
    try {
      const { ffmpeg, fetchFile } = ffmpegRef.current;
      const data = await fetchFile(file);
      await ffmpeg.writeFile("input.opus", data);
      await ffmpeg.exec(["-i", "input.opus", "-codec:a", "libmp3lame", "-q:a", "2", "output.mp3"]);
      const out = await ffmpeg.readFile("output.mp3");
      const bytes = out instanceof Uint8Array ? out : new TextEncoder().encode(String(out));
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      downloadBlob(new Blob([copy], { type: "audio/mpeg" }), `${file.name.replace(/\.[^.]+$/, "")}.mp3`);
      setStatus("done");
      setMessage(`Converted ${file.name} to MP3. Processing runs entirely in your browser.`);
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Conversion failed.");
    }
  };

  return (
    <ToolShell>
      {status === "loading" && <p className="text-sm text-theme-muted">Loading FFmpeg WASM…</p>}
      {status === "missing" && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800">
          <p className="font-semibold">FFmpeg packages not installed</p>
          <p className="mt-2">{message}</p>
          <p className="mt-2 text-theme-muted">This tool is client-only — no files are uploaded to a server.</p>
        </div>
      )}
      {(status === "ready" || status === "done" || status === "error" || status === "converting") && (
        <>
          <FileDropzone accept=".opus,audio/opus,audio/ogg" onFiles={convert} hint="Opus/Ogg audio converted locally via FFmpeg WASM" />
          {status === "converting" && <p className="text-sm text-theme-muted">Converting… this may take a moment.</p>}
          {message && (
            <p className="rounded-lg border border-theme-subtle bg-theme-surface/50 p-3 text-sm text-theme-muted">{message}</p>
          )}
        </>
      )}
    </ToolShell>
  );
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const cells = line.match(/("([^"]|"")*"|[^,]*)/g)?.map((c) => c.trim().replace(/^"|"$/g, "").replace(/""/g, '"')) ?? [];
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
}

export function CsvToJsonTool() {
  const { t } = useToolUi("csv-to-json");
  const [input, setInput] = useState("name,email\nAlice,alice@example.com\nBob,bob@example.com");
  const output = useMemo(() => {
    try {
      return JSON.stringify(parseCsv(input), null, 2);
    } catch {
      return "";
    }
  }, [input]);

  return (
    <ToolShell>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="input-field font-mono text-sm" placeholder="CSV with header row" />
      <CopyResultPanel title="JSON output" text={output} />
    </ToolShell>
  );
}

export function JsonToCsvTool() {
  const { t } = useToolUi("json-to-csv");
  const [input, setInput] = useState('[{"name":"Alice","email":"alice@example.com"},{"name":"Bob","email":"bob@example.com"}]');
  const [error, setError] = useState("");
  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      setError("");
      return toCsv(rows);
    } catch {
      setError("Invalid JSON array of objects.");
      return "";
    }
  }, [input]);

  return (
    <ToolShell>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="input-field font-mono text-sm" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <CopyResultPanel title="CSV output" text={output} />
    </ToolShell>
  );
}

export function ExcelToCsvTool() {
  const { t } = useToolUi("excel-to-csv");
  const [busy, setBusy] = useState(false);
  const [csv, setCsv] = useState("");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheet, setSheet] = useState("");
  const [missing, setMissing] = useState(false);

  const onFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setMissing(false);
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      setSheetNames(wb.SheetNames);
      const first = wb.SheetNames[0];
      setSheet(first);
      const ws = wb.Sheets[first];
      setCsv(XLSX.utils.sheet_to_csv(ws));
    } catch {
      setMissing(true);
      setCsv("");
    } finally {
      setBusy(false);
    }
  };

  const pickSheet = async (name: string, file?: File) => {
    if (!file) return;
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      setSheet(name);
      setCsv(XLSX.utils.sheet_to_csv(wb.Sheets[name]));
    } catch {
      setMissing(true);
    }
  };

  const [lastFile, setLastFile] = useState<File | null>(null);
  const handleFiles = (files: File[]) => {
    setLastFile(files[0] ?? null);
    onFile(files);
  };

  return (
    <ToolShell>
      <FileDropzone accept=".xlsx,.xls,.xlsm" onFiles={handleFiles} hint="Convert Excel sheets to CSV in your browser" />
      {missing && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800">
          Install the xlsx package: npm install xlsx
        </p>
      )}
      {busy && <p className="text-sm text-theme-muted">Reading workbook…</p>}
      {sheetNames.length > 1 && lastFile && (
        <div className="flex flex-wrap gap-2">
          {sheetNames.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => pickSheet(n, lastFile)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${sheet === n ? "bg-accent text-white" : "border border-theme text-theme-muted"}`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
      <CopyResultPanel title={`CSV${sheet ? ` — ${sheet}` : ""}`} text={csv} emptyHint="Upload an Excel file" />
    </ToolShell>
  );
}

interface BlurRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function FaceBlurTool() {
  const { t } = useToolUi("face-blur");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [rects, setRects] = useState<BlurRect[]>([]);
  const [drag, setDrag] = useState<{ id: string; mode: "move" | "draw"; startX: number; startY: number; orig: BlurRect } | null>(null);
  const [name, setName] = useState("blurred");
  const [pixelSize, setPixelSize] = useState(12);

  const render = useCallback(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    for (const r of rects) {
      const sx = Math.round((r.x / 100) * img.width);
      const sy = Math.round((r.y / 100) * img.height);
      const sw = Math.round((r.w / 100) * img.width);
      const sh = Math.round((r.h / 100) * img.height);
      if (sw < 2 || sh < 2) continue;
      const patch = document.createElement("canvas");
      patch.width = Math.max(1, Math.floor(sw / pixelSize));
      patch.height = Math.max(1, Math.floor(sh / pixelSize));
      const pctx = patch.getContext("2d")!;
      pctx.drawImage(img, sx, sy, sw, sh, 0, 0, patch.width, patch.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(patch, 0, 0, patch.width, patch.height, sx, sy, sw, sh);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, sw, sh);
    }
  }, [img, rects, pixelSize]);

  useEffect(() => {
    render();
  }, [render]);

  const onFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setName(f.name.replace(/\.[^.]+$/, ""));
    setRects([]);
    setImg(await loadImageFromFile(f));
  };

  const pointerToPct = (e: React.PointerEvent) => {
    const box = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(((e.clientX - box.left) / box.width) * 100, 0), 100),
      y: Math.min(Math.max(((e.clientY - box.top) / box.height) * 100, 0), 100),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return;
    const p = pointerToPct(e);
    const hit = [...rects].reverse().find((r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
    if (hit) {
      setDrag({ id: hit.id, mode: "move", startX: p.x, startY: p.y, orig: { ...hit } });
    } else {
      const id = crypto.randomUUID();
      setRects((prev) => [...prev, { id, x: p.x, y: p.y, w: 0, h: 0 }]);
      setDrag({ id, mode: "draw", startX: p.x, startY: p.y, orig: { id, x: p.x, y: p.y, w: 0, h: 0 } });
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const p = pointerToPct(e);
    setRects((prev) =>
      prev.map((r) => {
        if (r.id !== drag.id) return r;
        if (drag.mode === "move") {
          const dx = p.x - drag.startX;
          const dy = p.y - drag.startY;
          return {
            ...r,
            x: Math.min(Math.max(drag.orig.x + dx, 0), 100 - drag.orig.w),
            y: Math.min(Math.max(drag.orig.y + dy, 0), 100 - drag.orig.h),
          };
        }
        const x = Math.min(drag.startX, p.x);
        const y = Math.min(drag.startY, p.y);
        const w = Math.abs(p.x - drag.startX);
        const h = Math.abs(p.y - drag.startY);
        return { ...r, x, y, w: Math.min(w, 100 - x), h: Math.min(h, 100 - y) };
      })
    );
  };

  const download = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, `${name}-blurred.png`);
  };

  return (
    <ToolShell>
      <FileDropzone accept="image/*" onFiles={onFile} hint="Draw rectangles on faces or sensitive areas to pixelate" />
      {img && (
        <>
          <CalculatorSlider label="Pixel block size" value={pixelSize} min={4} max={32} step={2} unit=" px" onChange={setPixelSize} />
          <KPIStrip items={[{ label: "Blur regions", value: `${rects.length}`, highlight: true }]} />
          <div
            ref={containerRef}
            className="relative mx-auto max-w-2xl cursor-crosshair select-none overflow-hidden rounded-xl border border-theme-subtle"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDrag(null)}
          >
            <canvas ref={canvasRef} className="block w-full" />
          </div>
          <p className="text-center text-xs text-theme-subtle">Click and drag to add a blur region. Drag inside a region to move it.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setRects([])} className="rounded-xl border border-theme px-4 py-2 text-sm font-semibold text-theme-heading">
              Clear regions
            </button>
            <button type="button" onClick={download} className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white">
              <Download className="mr-2 inline h-4 w-4" />
              Download PNG
            </button>
          </div>
        </>
      )}
    </ToolShell>
  );
}
