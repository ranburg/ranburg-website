"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

/**
 * Educational LIC maturity estimate:
 * Maturity ≈ Sum Assured + (Bonus rate × SA/1000 × years) + Final Additional Bonus.
 * Bonus rates and FAB vary by plan/year — user-supplied estimates only.
 */
export default function LicMaturityEstimator() {
  const [planName, setPlanName] = useState("Jeevan Labh / similar endowment");
  const [sumAssured, setSumAssured] = useState(1000000);
  const [annualPremium, setAnnualPremium] = useState(50000);
  const [policyTerm, setPolicyTerm] = useState(25);
  const [ppt, setPpt] = useState(16);
  const [yearsElapsed, setYearsElapsed] = useState(5);
  const [bonusPerThousand, setBonusPerThousand] = useState(48);
  const [fabPerThousand, setFabPerThousand] = useState(25);
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5);

  const result = useMemo(() => {
    const yearsToMaturity = Math.max(0, policyTerm - yearsElapsed);
    const maturityYear = startYear + policyTerm;
    const vestedBonus = (bonusPerThousand * sumAssured) / 1000 * policyTerm;
    const fab = (fabPerThousand * sumAssured) / 1000;
    const maturityAmount = sumAssured + vestedBonus + fab;
    const totalPremiums = annualPremium * ppt;
    const gain = maturityAmount - totalPremiums;
    const approxCagr =
      totalPremiums > 0 && policyTerm > 0
        ? (Math.pow(maturityAmount / Math.max(totalPremiums / 2, 1), 1 / policyTerm) - 1) * 100
        : 0;

    return {
      yearsToMaturity,
      maturityYear,
      vestedBonus,
      fab,
      maturityAmount,
      totalPremiums,
      gain,
      approxCagr,
    };
  }, [
    sumAssured,
    annualPremium,
    policyTerm,
    ppt,
    yearsElapsed,
    bonusPerThousand,
    fabPerThousand,
    startYear,
  ]);

  return (
    <div className="space-y-6">
      <div className="glass-card space-y-4 p-6">
        <h3 className="font-semibold text-theme-heading">Policy inputs</h3>
        <div>
          <label className="mb-1 block text-xs text-theme-subtle">Plan / policy name</label>
          <input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="input-field"
            placeholder="e.g. LIC Jeevan Anand, Jeevan Labh, New Endowment"
          />
        </div>
        <CalculatorSlider label="Sum assured" value={sumAssured} min={50000} max={10000000} step={25000} prefix="₹" onChange={setSumAssured} />
        <CalculatorSlider label="Annual premium (approx)" value={annualPremium} min={5000} max={500000} step={1000} prefix="₹" onChange={setAnnualPremium} />
        <CalculatorSlider label="Policy term" value={policyTerm} min={5} max={40} step={1} unit=" yrs" onChange={setPolicyTerm} />
        <CalculatorSlider label="Premium paying term (PPT)" value={ppt} min={5} max={40} step={1} unit=" yrs" onChange={setPpt} />
        <CalculatorSlider label="Years already elapsed" value={yearsElapsed} min={0} max={Math.max(policyTerm - 1, 0)} step={1} unit=" yrs" onChange={setYearsElapsed} />
        <CalculatorSlider label="Policy start year" value={startYear} min={1980} max={new Date().getFullYear()} step={1} onChange={setStartYear} />
      </div>

      <div className="glass-card space-y-4 p-6">
        <h3 className="font-semibold text-theme-heading">Bonus assumptions (estimate)</h3>
        <p className="text-sm text-theme-muted">
          Enter simple reversionary bonus as ₹ per ₹1,000 sum assured per year, and optional Final Additional Bonus (FAB).
          Check your bonus statement or agent for realistic rates — this is not an LIC live lookup.
        </p>
        <CalculatorSlider
          label="Reversionary bonus (₹ / 1000 SA / year)"
          value={bonusPerThousand}
          min={0}
          max={80}
          step={1}
          prefix="₹"
          onChange={setBonusPerThousand}
        />
        <CalculatorSlider
          label="Final additional bonus FAB (₹ / 1000 SA)"
          value={fabPerThousand}
          min={0}
          max={100}
          step={1}
          prefix="₹"
          onChange={setFabPerThousand}
        />
      </div>

      <KPIStrip
        items={[
          { label: "Est. maturity amount", value: fmt(result.maturityAmount), highlight: true },
          { label: "Years to maturity", value: `${result.yearsToMaturity}` },
          { label: "Maturity year", value: `${result.maturityYear}` },
        ]}
      />
      <KPIStrip
        items={[
          { label: "Total premiums (PPT)", value: fmt(result.totalPremiums) },
          { label: "Est. vested bonus", value: fmt(result.vestedBonus) },
          { label: "Est. FAB", value: fmt(result.fab) },
          { label: "Est. gain vs premiums", value: fmt(result.gain) },
        ]}
      />

      <div className="rounded-2xl border border-theme bg-theme-surface/60 p-5 text-sm text-theme-muted">
        <p className="font-semibold text-theme-heading">{planName || "Your LIC plan"}</p>
        <p className="mt-2">
          Estimated maturity ≈ Sum assured ({fmt(sumAssured)}) + reversionary bonus over {policyTerm} years (
          {fmt(result.vestedBonus)}) + FAB ({fmt(result.fab)}).
        </p>
        <p className="mt-2 text-xs text-theme-subtle">
          Illustrative only. Actual LIC maturity depends on declared bonuses, plan conditions, paid-up/lapse status,
          loans, and claim settlement. Use the official LIC portal or branch for exact figures. Pair with the SWP
          calculator to model this maturity as a future corpus top-up.
        </p>
      </div>
    </div>
  );
}
