"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Upload, X } from "lucide-react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import { SITE } from "@/lib/siteConfig";

type QrStyle = "square" | "rounded" | "dots";
type ErrorLevel = "L" | "M" | "Q" | "H";

export default function QRGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://www.ranburg.com");
  const [size, setSize] = useState(320);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("H");
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [gradientEnd, setGradientEnd] = useState("");
  const [useGradient, setUseGradient] = useState(false);
  const [style, setStyle] = useState<QrStyle>("square");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(22);

  const renderQr = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const qr = QRCode.create(text, { errorCorrectionLevel: errorLevel });
      const modules = qr.modules;
      const count = modules.size;
      const margin = 2;
      const cell = Math.floor(size / (count + margin * 2));
      const canvas = canvasRef.current;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, size, size);

      const fill = useGradient && gradientEnd
        ? (() => {
            const g = ctx.createLinearGradient(0, 0, size, size);
            g.addColorStop(0, darkColor);
            g.addColorStop(1, gradientEnd);
            return g;
          })()
        : darkColor;

      const offset = margin * cell;
      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          if (!modules.get(row, col)) continue;
          const x = offset + col * cell;
          const y = offset + row * cell;
          ctx.fillStyle = fill;
          if (style === "dots") {
            ctx.beginPath();
            ctx.arc(x + cell / 2, y + cell / 2, cell * 0.42, 0, Math.PI * 2);
            ctx.fill();
          } else if (style === "rounded") {
            const r = cell * 0.28;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, cell - 2, cell - 2, r);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, cell, cell);
          }
        }
      }

      if (logoUrl) {
        const logo = new Image();
        await new Promise<void>((res, rej) => {
          logo.onload = () => res();
          logo.onerror = rej;
          logo.src = logoUrl;
        });
        const logoSize = (size * logoScale) / 100;
        const lx = (size - logoSize) / 2;
        const ly = (size - logoSize) / 2;
        ctx.fillStyle = lightColor;
        ctx.beginPath();
        ctx.roundRect(lx - 6, ly - 6, logoSize + 12, logoSize + 12, 12);
        ctx.fill();
        ctx.drawImage(logo, lx, ly, logoSize, logoSize);
      }
    } catch {
      /* invalid */
    }
  }, [text, size, errorLevel, darkColor, lightColor, gradientEnd, useGradient, style, logoUrl, logoScale]);

  useEffect(() => {
    renderQr();
  }, [renderQr]);

  const onLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/") && !file.name.endsWith(".svg")) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  const downloadJpg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.download = "qrcode.jpg";
    a.click();
  };

  const downloadSvg = async () => {
    const QRCode = (await import("qrcode")).default;
    const svg = await QRCode.toString(text, {
      type: "svg",
      errorCorrectionLevel: errorLevel,
      color: { dark: darkColor, light: lightColor },
      margin: 2,
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.svg";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-4 p-6">
          <label className="block text-sm font-medium text-theme-body">Text or URL</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="input-field text-sm" placeholder="https://example.com" />
          <div className="flex flex-wrap gap-2">
            {[
              { label: "URL", value: "https://www.ranburg.com" },
              { label: "WiFi", value: "WIFI:T:WPA;S:MyNetwork;P:mypassword;;" },
              { label: "Email", value: `mailto:${SITE.email}` },
              { label: "Phone", value: `tel:${SITE.phoneTel}` },
            ].map((preset) => (
              <button key={preset.label} type="button" onClick={() => setText(preset.value)} className="rounded-lg border border-theme-subtle px-3 py-1 text-xs text-theme-muted hover:border-accent/40 hover:text-accent">
                {preset.label}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-theme-body">QR style</label>
            <div className="flex gap-2">
              {(["square", "rounded", "dots"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStyle(s)} className={`rounded-lg px-3 py-1.5 text-xs capitalize ${style === s ? "bg-accent text-white" : "bg-theme-surface text-theme-muted"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-theme-body">Logo (PNG / SVG)</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-theme-subtle px-3 py-2 text-xs text-theme-muted hover:border-accent/40">
                <Upload className="h-4 w-4" /> Upload logo
                <input type="file" accept="image/png,image/svg+xml,.svg" className="hidden" onChange={(e) => e.target.files?.[0] && onLogoUpload(e.target.files[0])} />
              </label>
              {logoUrl && (
                <button type="button" onClick={() => setLogoUrl(null)} className="text-theme-subtle hover:text-red-400" aria-label="Remove logo">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col items-center justify-center p-6">
          <canvas ref={canvasRef} className="max-w-full rounded-xl" />
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={downloadPng} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              <Download className="h-4 w-4" /> PNG
            </button>
            <button type="button" onClick={downloadJpg} className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2 text-sm font-semibold text-white">
              <Download className="h-4 w-4" /> JPG
            </button>
            <button type="button" onClick={downloadSvg} className="inline-flex items-center gap-2 rounded-xl border border-theme-subtle px-4 py-2 text-sm font-semibold text-theme-heading">
              <Download className="h-4 w-4" /> SVG
            </button>
          </div>
        </div>
      </div>

      <AdvancedOptions>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Size (px)</label>
            <input type="number" min={128} max={1024} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Error correction</label>
            <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)} className="input-field">
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Foreground</label>
            <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Background</label>
            <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="input-field h-10 w-full cursor-pointer rounded-lg p-1" />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm text-theme-muted">
              <input type="checkbox" checked={useGradient} onChange={(e) => setUseGradient(e.target.checked)} />
              Gradient end color
            </label>
            <input type="color" value={gradientEnd || "#6366f1"} onChange={(e) => setGradientEnd(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg" disabled={!useGradient} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Logo size (%)</label>
            <input type="number" min={10} max={30} value={logoScale} onChange={(e) => setLogoScale(Number(e.target.value))} className="input-field" />
          </div>
        </div>
      </AdvancedOptions>
    </div>
  );
}
