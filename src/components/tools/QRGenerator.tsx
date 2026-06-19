"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import { SITE } from "@/lib/siteConfig";

export default function QRGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://www.ranburg.com");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!text.trim() || !canvasRef.current) return;
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled) return;
        await QRCode.toCanvas(canvasRef.current, text, {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: { dark: darkColor, light: lightColor },
        });
      } catch {
        /* invalid input */
      }
    })();
    return () => { cancelled = true; };
  }, [text, size, errorLevel, darkColor, lightColor]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <label className="mb-2 block text-sm font-medium text-theme-body">Text or URL</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="input-field text-sm" placeholder="https://example.com" />
          <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <canvas ref={canvasRef} className="rounded-xl" />
          <button type="button" onClick={download} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90">
            <Download className="h-4 w-4" /> Download PNG
          </button>
        </div>
      </div>

      <AdvancedOptions>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Size (px)</label>
            <input type="number" min={128} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Error correction</label>
            <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as typeof errorLevel)} className="input-field">
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Dark color</label>
            <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Light color</label>
            <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg" />
          </div>
        </div>
      </AdvancedOptions>
    </div>
  );
}
