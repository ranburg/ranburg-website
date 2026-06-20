"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import ResultCard from "@/components/tools/ResultCard";

export function ProfitMarginTool() {
  const [revenue, setRevenue] = useState(100000);
  const [cogs, setCogs] = useState(40000);
  const [opex, setOpex] = useState(30000);
  const gross = revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0;
  const net = revenue > 0 ? ((revenue - cogs - opex) / revenue) * 100 : 0;
  return (
    <CalcLayout>
      <CalculatorSlider label="Revenue" value={revenue} min={0} max={1000000} step={1000} unit="$" onChange={setRevenue} />
      <CalculatorSlider label="Cost of goods" value={cogs} min={0} max={revenue} step={500} unit="$" onChange={setCogs} />
      <CalculatorSlider label="Operating expenses" value={opex} min={0} max={revenue} step={500} unit="$" onChange={setOpex} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard label="Gross margin" value={gross} format="percent" />
        <ResultCard label="Net margin" value={net} format="percent" />
      </div>
    </CalcLayout>
  );
}

export function RoiCalculatorTool() {
  const [cost, setCost] = useState(1000);
  const [gain, setGain] = useState(1500);
  const roi = useMemo(() => (cost > 0 ? ((gain - cost) / cost) * 100 : 0), [cost, gain]);
  const profit = gain - cost;
  return (
    <CalcLayout>
      <CalculatorSlider label="Investment cost" value={cost} min={0} max={100000} step={100} unit="$" onChange={setCost} />
      <CalculatorSlider label="Return value" value={gain} min={0} max={200000} step={100} unit="$" onChange={setGain} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard label="ROI" value={roi} format="percent" />
        <ResultCard label="Net gain" value={profit} />
      </div>
    </CalcLayout>
  );
}

export function BreakEvenTool() {
  const [fixed, setFixed] = useState(50000);
  const [variable, setVariable] = useState(20);
  const [price, setPrice] = useState(50);
  const units = price > variable ? Math.ceil(fixed / (price - variable)) : 0;
  const revenue = units * price;
  return (
    <CalcLayout>
      <CalculatorSlider label="Fixed costs" value={fixed} min={0} max={500000} step={1000} unit="$" onChange={setFixed} />
      <CalculatorSlider label="Variable cost / unit" value={variable} min={0} max={price} step={1} unit="$" onChange={setVariable} />
      <CalculatorSlider label="Price / unit" value={price} min={1} max={500} step={1} unit="$" onChange={setPrice} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard label="Break-even units" value={units} format="plain" />
        <ResultCard label="Break-even revenue" value={revenue} />
      </div>
    </CalcLayout>
  );
}

function CalcLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
