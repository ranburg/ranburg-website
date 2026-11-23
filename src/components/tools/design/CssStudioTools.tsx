"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Shuffle, Trash2 } from "lucide-react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import CopyButton from "@/components/ui/CopyButton";
import { Panel, Segmented, ToolNote, ToolStack, ghostButton } from "@/components/tools/kit";
import {
  PALETTE_SCHEMES,
  buildBoxShadowCss,
  buildGradientCss,
  buildPalette,
  hslToHex,
  normalizeHex,
  readableTextColor,
  shadeScale,
  type GradientStop,
  type GradientType,
  type PaletteScheme,
  type ShadowLayer,
} from "@/lib/plannerMath";

function randomHex(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const hue = (bytes[0] / 255) * 360;
  return hslToHex(hue, 62 + (bytes[1] / 255) * 30, 46 + (bytes[2] / 255) * 16);
}

function ColorField({ value, onChange, label }: { value: string; onChange: (hex: string) => void; label: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={`${label} picker`}
        value={normalizeHex(value) ?? "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-theme-subtle bg-transparent p-1"
      />
      <input
        type="text"
        aria-label={`${label} hex`}
        spellCheck={false}
        value={draft ?? value}
        onChange={(e) => {
          setDraft(e.target.value);
          const hex = normalizeHex(e.target.value);
          if (hex) onChange(hex);
        }}
        onBlur={() => setDraft(null)}
        className="input-field w-28 font-mono text-sm uppercase"
      />
    </div>
  );
}

function CodeOutput({ code, slug }: { code: string; slug: string }) {
  return (
    <Panel title="CSS" action={<CopyButton text={code} label="Copy CSS" toolSlug={slug} />}>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-theme-subtle bg-[var(--background)] p-4 font-mono text-sm leading-relaxed text-theme-body">
        {code}
      </pre>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */

const GRADIENT_PRESETS: { name: string; angle: number; stops: GradientStop[] }[] = [
  { name: "Mint aurora", angle: 135, stops: [{ color: "#2ee6c8", position: 0 }, { color: "#6366f1", position: 100 }] },
  { name: "Sunset", angle: 120, stops: [{ color: "#f97316", position: 0 }, { color: "#ec4899", position: 55 }, { color: "#8b5cf6", position: 100 }] },
  { name: "Deep ocean", angle: 160, stops: [{ color: "#0ea5e9", position: 0 }, { color: "#1e3a8a", position: 100 }] },
  { name: "Lime pop", angle: 90, stops: [{ color: "#bef264", position: 0 }, { color: "#22c55e", position: 100 }] },
  { name: "Night", angle: 180, stops: [{ color: "#1d1d1d", position: 0 }, { color: "#0d0d0d", position: 60 }, { color: "#134e4a", position: 100 }] },
  { name: "Peach", angle: 45, stops: [{ color: "#fde68a", position: 0 }, { color: "#fda4af", position: 100 }] },
];

export function CssGradientTool() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<(GradientStop & { id: number })[]>([
    { id: 1, color: "#2ee6c8", position: 0 },
    { id: 2, color: "#6366f1", position: 100 },
  ]);
  const [nextId, setNextId] = useState(3);

  const gradient = useMemo(() => buildGradientCss(type, angle, stops), [type, angle, stops]);
  const css = `background: ${gradient};`;

  const update = (id: number, patch: Partial<GradientStop>) =>
    setStops((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const applyStops = (next: GradientStop[]) => {
    setStops(next.map((s, i) => ({ ...s, id: nextId + i })));
    setNextId((n) => n + next.length);
  };

  return (
    <ToolStack>
      <div
        className="h-56 w-full rounded-[1.5rem] border border-theme-subtle transition-[background] duration-300 sm:h-72"
        style={{ background: gradient }}
        role="img"
        aria-label="Gradient preview"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Gradient type"
          value={type}
          onChange={setType}
          options={[
            { value: "linear", label: "Linear" },
            { value: "radial", label: "Radial" },
            { value: "conic", label: "Conic" },
          ]}
        />
        <button
          type="button"
          className={ghostButton}
          onClick={() => {
            applyStops([
              { color: randomHex(), position: 0 },
              { color: randomHex(), position: 100 },
            ]);
            setAngle(Math.round(Math.random() * 360));
          }}
        >
          <Shuffle className="h-4 w-4" /> Surprise me
        </button>
      </div>
      {type !== "radial" && (
        <CalculatorSlider label={type === "conic" ? "Start angle" : "Angle"} value={angle} min={0} max={360} step={1} unit="°" onChange={setAngle} />
      )}
      <Panel
        title="Colour stops"
        action={
          <button
            type="button"
            className={ghostButton}
            disabled={stops.length >= 6}
            onClick={() => {
              setStops((list) => [...list, { id: nextId, color: randomHex(), position: 50 }]);
              setNextId((n) => n + 1);
            }}
          >
            <Plus className="h-4 w-4" /> Add stop
          </button>
        }
      >
        <div className="space-y-4">
          {stops.map((stop, i) => (
            <div key={stop.id} className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <ColorField label={`Stop ${i + 1}`} value={stop.color} onChange={(color) => update(stop.id, { color })} />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={stop.position}
                  aria-label={`Stop ${i + 1} position`}
                  onChange={(e) => update(stop.id, { position: Number(e.target.value) })}
                />
                <span className="w-12 shrink-0 text-end text-sm tabular-nums text-theme-muted">{stop.position}%</span>
              </div>
              <button
                type="button"
                aria-label={`Remove stop ${i + 1}`}
                className={`${ghostButton} h-11 w-11 !px-0`}
                disabled={stops.length <= 2}
                onClick={() => setStops((list) => list.filter((s) => s.id !== stop.id))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Panel>
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-theme-subtle">Presets</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              title={preset.name}
              aria-label={`Use ${preset.name} preset`}
              onClick={() => {
                applyStops(preset.stops);
                setAngle(preset.angle);
                setType("linear");
              }}
              className="h-14 rounded-xl border border-theme-subtle transition-transform duration-300 hover:-translate-y-1 hover:border-accent/60"
              style={{ background: buildGradientCss("linear", preset.angle, preset.stops) }}
            />
          ))}
        </div>
      </div>
      <CodeOutput code={css} slug="css-gradient-generator" />
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

const SHADOW_PRESETS: { name: string; layers: ShadowLayer[] }[] = [
  { name: "Soft", layers: [{ x: 0, y: 12, blur: 32, spread: -8, color: "#000000", opacity: 28, inset: false }] },
  {
    name: "Layered",
    layers: [
      { x: 0, y: 1, blur: 2, spread: 0, color: "#000000", opacity: 20, inset: false },
      { x: 0, y: 8, blur: 16, spread: -4, color: "#000000", opacity: 22, inset: false },
      { x: 0, y: 24, blur: 48, spread: -12, color: "#000000", opacity: 30, inset: false },
    ],
  },
  { name: "Glow", layers: [{ x: 0, y: 0, blur: 40, spread: 0, color: "#2ee6c8", opacity: 55, inset: false }] },
  { name: "Hard", layers: [{ x: 8, y: 8, blur: 0, spread: 0, color: "#000000", opacity: 100, inset: false }] },
  { name: "Inset", layers: [{ x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 40, inset: true }] },
];

export function BoxShadowTool() {
  const [layers, setLayers] = useState<(ShadowLayer & { id: number })[]>([
    { id: 1, x: 0, y: 12, blur: 32, spread: -8, color: "#000000", opacity: 28, inset: false },
  ]);
  const [nextId, setNextId] = useState(2);
  const [active, setActive] = useState(1);
  const [boxColor, setBoxColor] = useState("#2ee6c8");
  const [canvasColor, setCanvasColor] = useState("#f4f4f5");
  const [radius, setRadius] = useState(24);

  const shadow = useMemo(() => buildBoxShadowCss(layers), [layers]);
  const css = `box-shadow: ${shadow};\nborder-radius: ${radius}px;`;
  const current = layers.find((l) => l.id === active) ?? layers[0];

  const update = (patch: Partial<ShadowLayer>) =>
    setLayers((list) => list.map((l) => (l.id === current.id ? { ...l, ...patch } : l)));

  const applyLayers = (next: ShadowLayer[]) => {
    const withIds = next.map((l, i) => ({ ...l, id: nextId + i }));
    setLayers(withIds);
    setActive(withIds[0].id);
    setNextId((n) => n + next.length);
  };

  return (
    <ToolStack>
      <div
        className="flex h-64 items-center justify-center rounded-[1.5rem] border border-theme-subtle transition-colors duration-300 sm:h-80"
        style={{ background: canvasColor }}
      >
        <div
          className="h-28 w-40 transition-[box-shadow,border-radius,background] duration-200 sm:h-36 sm:w-56"
          style={{ background: boxColor, boxShadow: shadow, borderRadius: radius }}
          role="img"
          aria-label="Box shadow preview"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {SHADOW_PRESETS.map((preset) => (
          <button key={preset.name} type="button" className={ghostButton} onClick={() => applyLayers(preset.layers)}>
            {preset.name}
          </button>
        ))}
      </div>
      <Panel
        title="Shadow layers"
        action={
          <button
            type="button"
            className={ghostButton}
            disabled={layers.length >= 4}
            onClick={() => {
              setLayers((list) => [...list, { id: nextId, x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 20, inset: false }]);
              setActive(nextId);
              setNextId((n) => n + 1);
            }}
          >
            <Plus className="h-4 w-4" /> Add layer
          </button>
        }
      >
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {layers.map((layer, i) => (
            <button
              key={layer.id}
              type="button"
              aria-pressed={layer.id === current.id}
              onClick={() => setActive(layer.id)}
              className={
                layer.id === current.id
                  ? "rounded-xl bg-accent px-3.5 py-2 text-sm font-medium text-on-accent"
                  : `${ghostButton}`
              }
            >
              Layer {i + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Remove selected layer"
            className={`${ghostButton} ms-auto h-10 w-10 !px-0`}
            disabled={layers.length <= 1}
            onClick={() => {
              const rest = layers.filter((l) => l.id !== current.id);
              setLayers(rest);
              setActive(rest[0].id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorSlider label="Horizontal offset" value={current.x} min={-100} max={100} step={1} unit="px" onChange={(x) => update({ x })} />
          <CalculatorSlider label="Vertical offset" value={current.y} min={-100} max={100} step={1} unit="px" onChange={(y) => update({ y })} />
          <CalculatorSlider label="Blur" value={current.blur} min={0} max={200} step={1} unit="px" onChange={(blur) => update({ blur })} />
          <CalculatorSlider label="Spread" value={current.spread} min={-100} max={100} step={1} unit="px" onChange={(spread) => update({ spread })} />
          <CalculatorSlider label="Opacity" value={current.opacity} min={0} max={100} step={1} unit="%" onChange={(opacity) => update({ opacity })} />
          <div className="space-y-3">
            <p className="text-sm font-medium text-theme-body">Shadow colour</p>
            <ColorField label="Shadow colour" value={current.color} onChange={(color) => update({ color })} />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-body">
              <input
                type="checkbox"
                checked={current.inset}
                onChange={(e) => update({ inset: e.target.checked })}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              Inset shadow
            </label>
          </div>
        </div>
      </Panel>
      <Panel title="Preview options">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-theme-body">Box colour</p>
            <ColorField label="Box colour" value={boxColor} onChange={setBoxColor} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-theme-body">Canvas colour</p>
            <ColorField label="Canvas colour" value={canvasColor} onChange={setCanvasColor} />
          </div>
          <CalculatorSlider label="Corner radius" value={radius} min={0} max={100} step={1} unit="px" onChange={setRadius} />
        </div>
      </Panel>
      <CodeOutput code={css} slug="box-shadow-generator" />
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

function Swatch({ hex, label, tall = false }: { hex: string; label?: string; tall?: boolean }) {
  const [copied, setCopied] = useState(false);
  const text = readableTextColor(hex);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(hex.toUpperCase());
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard unavailable */
        }
      }}
      aria-label={`Copy ${hex.toUpperCase()}`}
      className={`group flex w-full flex-col justify-end rounded-xl p-3 text-start transition-transform duration-300 hover:-translate-y-1 ${tall ? "h-32 sm:h-44" : "h-20"}`}
      style={{ background: hex, color: text }}
    >
      {label ? <span className="text-[11px] font-medium opacity-70">{label}</span> : null}
      <span className="flex items-center gap-1.5 font-mono text-xs font-medium sm:text-sm">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          hex.toUpperCase()
        )}
      </span>
    </button>
  );
}

export function ColorPaletteTool() {
  const [base, setBase] = useState("#2ee6c8");
  const [scheme, setScheme] = useState<PaletteScheme>("analogous");

  const palette = useMemo(() => buildPalette(base, scheme), [base, scheme]);
  const scale = useMemo(() => shadeScale(base), [base]);

  const cssVars = useMemo(
    () =>
      [
        ":root {",
        ...palette.map((hex, i) => `  --palette-${i + 1}: ${hex};`),
        ...scale.map((s) => `  --brand-${s.step}: ${s.hex};`),
        "}",
      ].join("\n"),
    [palette, scale]
  );
  const tailwind = useMemo(
    () => ["brand: {", ...scale.map((s) => `  ${s.step}: "${s.hex}",`), "},"].join("\n"),
    [scale]
  );

  return (
    <ToolStack>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-theme-body">Base colour</p>
          <ColorField label="Base colour" value={base} onChange={setBase} />
        </div>
        <button type="button" className={ghostButton} onClick={() => setBase(randomHex())}>
          <Shuffle className="h-4 w-4" /> Random colour
        </button>
      </div>
      <Segmented
        label="Colour harmony"
        value={scheme}
        onChange={setScheme}
        options={PALETTE_SCHEMES.map((s) => ({ value: s.id, label: s.label }))}
      />
      <div className="grid grid-cols-5 gap-2">
        {palette.map((hex, i) => (
          <Swatch key={`${hex}-${i}`} hex={hex} tall />
        ))}
      </div>
      <Panel title="Tint and shade scale">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {scale.map((s) => (
            <Swatch key={s.step} hex={s.hex} label={String(s.step)} />
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="CSS variables" action={<CopyButton text={cssVars} toolSlug="color-palette-generator" />}>
          <pre className="max-h-64 overflow-auto rounded-xl border border-theme-subtle bg-[var(--background)] p-4 font-mono text-xs leading-relaxed text-theme-body">
            {cssVars}
          </pre>
        </Panel>
        <Panel title="Tailwind colours" action={<CopyButton text={tailwind} toolSlug="color-palette-generator" />}>
          <pre className="max-h-64 overflow-auto rounded-xl border border-theme-subtle bg-[var(--background)] p-4 font-mono text-xs leading-relaxed text-theme-body">
            {tailwind}
          </pre>
        </Panel>
      </div>
      <ToolNote>
        Click any swatch to copy its HEX code. Harmonies are built by rotating hue on the HSL colour wheel — check text contrast
        before using a pair for body copy.
      </ToolNote>
    </ToolStack>
  );
}
