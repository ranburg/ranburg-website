"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

/** Beginning-of-year PPF deposits, annual compounding. */
export default function PpfCalculator() {
  const [annual, setAnnual] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const r = rate / 100;
    let corpus = 0;
    let deposited = 0;
    for (let y = 0; y < years; y++) {
      corpus = (corpus + annual) * (1 + r);
      deposited += annual;
    }
    return {
      maturity: corpus,
      deposited,
      interest: corpus - deposited,
    };
  }, [annual, rate, years]);

  return (
    <div className="space-y-6">
      <CalculatorSlider
        label="Yearly deposit"
        value={annual}
        min={500}
        max={150000}
        step={500}
        prefix="₹"
        onChange={setAnnual}
      />
      <CalculatorSlider
        label="Interest rate (% p.a.)"
        value={rate}
        min={6}
        max={9}
        step={0.1}
        unit="%"
        onChange={setRate}
      />
      <CalculatorSlider
        label="Tenure (years)"
        value={years}
        min={15}
        max={50}
        step={5}
        unit=" yrs"
        onChange={setYears}
      />
      <KPIStrip
        items={[
          { label: "Maturity value", value: fmt(result.maturity) },
          { label: "Total deposits", value: fmt(result.deposited) },
          { label: "Interest earned", value: fmt(result.interest) },
        ]}
      />
      <p className="text-xs text-theme-subtle">
        Illustrative only. PPF interest is notified by the Government of India and can change. Maximum deposit is
        ₹1.5 lakh per financial year. Not tax advice.
      </p>
    </div>
  );
}
