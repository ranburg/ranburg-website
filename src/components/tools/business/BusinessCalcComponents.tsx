"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip, ScenarioCompare } from "@/components/tools/viz";

function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function ProfitMarginTool() {
  const [revenue, setRevenue] = useState(100000);
  const [cogs, setCogs] = useState(40000);
  const [opex, setOpex] = useState(30000);
  const [altCogs, setAltCogs] = useState(35000);

  const gross = revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0;
  const net = revenue > 0 ? ((revenue - cogs - opex) / revenue) * 100 : 0;
  const grossAlt = revenue > 0 ? ((revenue - altCogs) / revenue) * 100 : 0;
  const netAlt = revenue > 0 ? ((revenue - altCogs - opex) / revenue) * 100 : 0;
  const profit = revenue - cogs - opex;

  const chart = [
    { name: "Revenue", value: revenue },
    { name: "COGS", value: cogs },
    { name: "OpEx", value: opex },
    { name: "Profit", value: Math.max(profit, 0) },
  ];

  return (
    <CalcLayout>
      <CalculatorSlider label="Revenue" value={revenue} min={0} max={1000000} step={1000} prefix="$" onChange={setRevenue} />
      <CalculatorSlider label="Cost of goods" value={cogs} min={0} max={Math.max(revenue, 1)} step={500} prefix="$" onChange={setCogs} />
      <CalculatorSlider label="Operating expenses" value={opex} min={0} max={Math.max(revenue, 1)} step={500} prefix="$" onChange={setOpex} />
      <CalculatorSlider label="Alt COGS (scenario B)" value={altCogs} min={0} max={Math.max(revenue, 1)} step={500} prefix="$" onChange={setAltCogs} />
      <KPIStrip
        items={[
          { label: "Gross margin", value: `${gross.toFixed(1)}%`, highlight: true },
          { label: "Net margin", value: `${net.toFixed(1)}%` },
          { label: "Net profit", value: fmtUsd(profit) },
        ]}
      />
      <ScenarioCompare
        title="Cost scenario"
        columnA="Current COGS"
        columnB="Alt COGS"
        rows={[
          { label: "Gross margin", a: `${gross.toFixed(1)}%`, b: `${grossAlt.toFixed(1)}%` },
          { label: "Net margin", a: `${net.toFixed(1)}%`, b: `${netAlt.toFixed(1)}%` },
        ]}
      />
      <ChartCard data={chart} />
    </CalcLayout>
  );
}

export function RoiCalculatorTool() {
  const [cost, setCost] = useState(1000);
  const [gain, setGain] = useState(1500);
  const [altGain, setAltGain] = useState(1800);
  const roi = useMemo(() => (cost > 0 ? ((gain - cost) / cost) * 100 : 0), [cost, gain]);
  const roiB = useMemo(() => (cost > 0 ? ((altGain - cost) / cost) * 100 : 0), [cost, altGain]);
  const profit = gain - cost;
  const chart = [
    { name: "Cost", value: cost },
    { name: "Return A", value: gain },
    { name: "Return B", value: altGain },
  ];
  return (
    <CalcLayout>
      <CalculatorSlider label="Investment cost" value={cost} min={0} max={100000} step={100} prefix="$" onChange={setCost} />
      <CalculatorSlider label="Return value (A)" value={gain} min={0} max={200000} step={100} prefix="$" onChange={setGain} />
      <CalculatorSlider label="Return value (B)" value={altGain} min={0} max={200000} step={100} prefix="$" onChange={setAltGain} />
      <KPIStrip
        items={[
          { label: "ROI A", value: `${roi.toFixed(1)}%`, highlight: true },
          { label: "ROI B", value: `${roiB.toFixed(1)}%` },
          { label: "Net gain A", value: fmtUsd(profit) },
        ]}
      />
      <ScenarioCompare
        columnA="Scenario A"
        columnB="Scenario B"
        rows={[
          { label: "ROI", a: `${roi.toFixed(1)}%`, b: `${roiB.toFixed(1)}%` },
          { label: "Net gain", a: fmtUsd(gain - cost), b: fmtUsd(altGain - cost) },
        ]}
      />
      <ChartCard data={chart} />
    </CalcLayout>
  );
}

export function BreakEvenTool() {
  const [fixed, setFixed] = useState(50000);
  const [variable, setVariable] = useState(20);
  const [price, setPrice] = useState(50);
  const [altPrice, setAltPrice] = useState(55);
  const units = price > variable ? Math.ceil(fixed / (price - variable)) : 0;
  const unitsB = altPrice > variable ? Math.ceil(fixed / (altPrice - variable)) : 0;
  const revenue = units * price;
  const chart = [
    { name: "Fixed", value: fixed },
    { name: "BE rev A", value: revenue },
    { name: "BE rev B", value: unitsB * altPrice },
  ];
  return (
    <CalcLayout>
      <CalculatorSlider label="Fixed costs" value={fixed} min={0} max={500000} step={1000} prefix="$" onChange={setFixed} />
      <CalculatorSlider label="Variable cost / unit" value={variable} min={0} max={Math.max(price, 1)} step={1} prefix="$" onChange={setVariable} />
      <CalculatorSlider label="Price / unit (A)" value={price} min={1} max={500} step={1} prefix="$" onChange={setPrice} />
      <CalculatorSlider label="Price / unit (B)" value={altPrice} min={1} max={500} step={1} prefix="$" onChange={setAltPrice} />
      <KPIStrip
        items={[
          { label: "Break-even units", value: units.toLocaleString(), highlight: true },
          { label: "Break-even revenue", value: fmtUsd(revenue) },
          { label: "Contribution / unit", value: fmtUsd(price - variable) },
        ]}
      />
      <ScenarioCompare
        columnA={`$${price}/unit`}
        columnB={`$${altPrice}/unit`}
        rows={[
          { label: "Units to break even", a: units.toLocaleString(), b: unitsB.toLocaleString() },
          { label: "Revenue needed", a: fmtUsd(revenue), b: fmtUsd(unitsB * altPrice) },
        ]}
      />
      <ChartCard data={chart} />
    </CalcLayout>
  );
}

function ChartCard({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-56 rounded-xl border border-theme-subtle bg-theme-surface/40 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => fmtUsd(v)} />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CalcLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
