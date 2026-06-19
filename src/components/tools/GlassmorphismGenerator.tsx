"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import CopyButton from "@/components/ui/CopyButton";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(10);
  const [borderOpacity, setBorderOpacity] = useState(15);
  const [radius, setRadius] = useState(16);
  const [shadowIntensity, setShadowIntensity] = useState(30);
  const [bgR, setBgR] = useState(15);
  const [bgG, setBgG] = useState(23);
  const [bgB, setBgB] = useState(42);

  const css = useMemo(
    () => `.glass-element {
  background: rgba(${bgR}, ${bgG}, ${bgB}, ${opacity / 100});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid rgba(255, 255, 255, ${borderOpacity / 100});
  border-radius: ${radius}px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, ${shadowIntensity / 100}),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}`,
    [blur, opacity, borderOpacity, radius, shadowIntensity, bgR, bgG, bgB]
  );

  const previewStyle = {
    background: `rgba(${bgR}, ${bgG}, ${bgB}, ${opacity / 100})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
    borderRadius: `${radius}px`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${shadowIntensity / 100}), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
  } as React.CSSProperties;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-6 p-6">
        <h2 className="text-lg font-bold text-theme-heading">Customize Effect</h2>
        <CalculatorSlider label="Blur Amount" value={blur} min={0} max={40} step={1} unit="px" onChange={setBlur} />
        <CalculatorSlider label="Background Opacity" value={opacity} min={0} max={50} step={1} unit="%" onChange={setOpacity} />
        <CalculatorSlider label="Border Opacity" value={borderOpacity} min={0} max={50} step={1} unit="%" onChange={setBorderOpacity} />
        <CalculatorSlider label="Border Radius" value={radius} min={0} max={48} step={2} unit="px" onChange={setRadius} />
        <AdvancedOptions>
          <CalculatorSlider label="Shadow Intensity" value={shadowIntensity} min={0} max={60} step={5} unit="%" onChange={setShadowIntensity} />
          <CalculatorSlider label="Background Red" value={bgR} min={0} max={255} step={1} onChange={setBgR} />
          <CalculatorSlider label="Background Green" value={bgG} min={0} max={255} step={1} onChange={setBgG} />
          <CalculatorSlider label="Background Blue" value={bgB} min={0} max={255} step={1} onChange={setBgB} />
        </AdvancedOptions>
      </div>

      <div className="space-y-6">
        <div
          className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl"
          style={{ background: "linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #8b5cf6 100%)" }}
        >
          <div className="px-8 py-6 text-center" style={previewStyle}>
            <p className="font-semibold text-theme-heading">Glass Preview</p>
            <p className="mt-1 text-sm text-theme-body">Frosted glass effect</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-theme-body">Generated CSS</label>
            <CopyButton text={css} />
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-950/50 p-4 font-mono text-xs text-accent-emerald">{css}</pre>
        </div>
      </div>
    </div>
  );
}
