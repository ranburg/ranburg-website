"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "length" | "weight" | "temperature" | "volume" | "area" | "speed";

const UNITS: Record<Category, { id: string; label: string; toBase: number }[]> = {
  length: [
    { id: "m", label: "Meters", toBase: 1 },
    { id: "km", label: "Kilometers", toBase: 1000 },
    { id: "cm", label: "Centimeters", toBase: 0.01 },
    { id: "mm", label: "Millimeters", toBase: 0.001 },
    { id: "mi", label: "Miles", toBase: 1609.344 },
    { id: "yd", label: "Yards", toBase: 0.9144 },
    { id: "ft", label: "Feet", toBase: 0.3048 },
    { id: "in", label: "Inches", toBase: 0.0254 },
  ],
  weight: [
    { id: "kg", label: "Kilograms", toBase: 1 },
    { id: "g", label: "Grams", toBase: 0.001 },
    { id: "mg", label: "Milligrams", toBase: 0.000001 },
    { id: "lb", label: "Pounds", toBase: 0.453592 },
    { id: "oz", label: "Ounces", toBase: 0.0283495 },
    { id: "t", label: "Metric Tons", toBase: 1000 },
  ],
  temperature: [
    { id: "c", label: "Celsius", toBase: 1 },
    { id: "f", label: "Fahrenheit", toBase: 1 },
    { id: "k", label: "Kelvin", toBase: 1 },
  ],
  volume: [
    { id: "l", label: "Liters", toBase: 1 },
    { id: "ml", label: "Milliliters", toBase: 0.001 },
    { id: "gal", label: "US Gallons", toBase: 3.78541 },
    { id: "qt", label: "US Quarts", toBase: 0.946353 },
    { id: "cup", label: "US Cups", toBase: 0.236588 },
    { id: "floz", label: "US Fluid Oz", toBase: 0.0295735 },
  ],
  area: [
    { id: "sqm", label: "Sq Meters", toBase: 1 },
    { id: "sqkm", label: "Sq Kilometers", toBase: 1e6 },
    { id: "sqft", label: "Sq Feet", toBase: 0.092903 },
    { id: "sqmi", label: "Sq Miles", toBase: 2589988.11 },
    { id: "acre", label: "Acres", toBase: 4046.86 },
    { id: "ha", label: "Hectares", toBase: 10000 },
  ],
  speed: [
    { id: "mps", label: "Meters/sec", toBase: 1 },
    { id: "kph", label: "Kilometers/hr", toBase: 0.277778 },
    { id: "mph", label: "Miles/hr", toBase: 0.44704 },
    { id: "knot", label: "Knots", toBase: 0.514444 },
  ],
};

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "length", label: "Length" },
  { id: "weight", label: "Weight" },
  { id: "temperature", label: "Temperature" },
  { id: "volume", label: "Volume" },
  { id: "area", label: "Area" },
  { id: "speed", label: "Speed" },
];

function convertTemp(value: number, from: string, to: string): number {
  let c = value;
  if (from === "f") c = (value - 32) * (5 / 9);
  else if (from === "k") c = value - 273.15;
  if (to === "f") return c * (9 / 5) + 32;
  if (to === "k") return c + 273.15;
  return c;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const units = UNITS[category];
  const [fromUnit, setFromUnit] = useState(units[0].id);
  const [toUnit, setToUnit] = useState(units[1]?.id ?? units[0].id);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "—";
    if (category === "temperature") return convertTemp(num, fromUnit, toUnit).toFixed(4);
    const from = units.find((u) => u.id === fromUnit)!;
    const to = units.find((u) => u.id === toUnit)!;
    return ((num * from.toBase) / to.toBase).toFixed(6);
  }, [value, fromUnit, toUnit, category, units]);

  const switchCategory = (cat: Category) => {
    setCategory(cat);
    const u = UNITS[cat];
    setFromUnit(u[0].id);
    setToUnit(u[1]?.id ?? u[0].id);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setValue(result === "—" ? value : result);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => switchCategory(c.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition",
              category === c.id ? "bg-accent text-white" : "bg-theme-surface text-theme-muted hover:text-theme-heading"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <label className="mb-2 block text-sm text-theme-muted">From</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field mb-3">
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input-field text-lg font-semibold" />
          </div>
          <button type="button" onClick={swap} className="mb-2 rounded-xl border border-theme-subtle p-3 text-theme-muted hover:border-accent/40 hover:text-accent" aria-label="Swap units">
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">To</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="input-field mb-3">
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <div className="rounded-xl border border-theme bg-theme-surface px-4 py-3 text-lg font-semibold text-accent">{result}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
