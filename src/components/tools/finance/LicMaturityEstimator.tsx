"use client";

import { useToolUi } from "@/hooks/useToolUi";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";
import {
  getDefaultFab,
  getLicPlan,
  getPlanBonusRate,
  LIC_PLANS,
  type LicPlanId,
} from "@/lib/licPlans";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function LicMaturityEstimator() {
  const { t } = useToolUi("lic-maturity-calculator");
  const [planId, setPlanId] = useState<LicPlanId>("jeevan-labh-736");
  const plan = getLicPlan(planId);
  const [termIndex, setTermIndex] = useState(2);
  const termOption = plan.terms[Math.min(termIndex, plan.terms.length - 1)] ?? plan.terms[0];

  const [sumAssured, setSumAssured] = useState(1000000);
  const [annualPremium, setAnnualPremium] = useState(50000);
  const [yearsElapsed, setYearsElapsed] = useState(5);
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5);
  const [overrideBonus, setOverrideBonus] = useState(false);
  const [bonusPerThousand, setBonusPerThousand] = useState(48);
  const [overrideFab, setOverrideFab] = useState(false);
  const [fabPerThousand, setFabPerThousand] = useState(45);
  const [customPpt, setCustomPpt] = useState(16);

  // When plan changes, reset to a sensible term and auto bonus/FAB
  useEffect(() => {
    const idx = Math.min(termIndex, plan.terms.length - 1);
    setTermIndex(idx >= 0 ? idx : 0);
    const t = plan.terms[idx >= 0 ? idx : 0];
    if (!t) return;
    if (!overrideBonus) {
      setBonusPerThousand(getPlanBonusRate(planId, t.term, sumAssured));
    }
    if (!overrideFab) {
      setFabPerThousand(getDefaultFab(t.term));
    }
    setCustomPpt(t.ppt);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to plan switch
  }, [planId]);

  // Keep auto bonus in sync with term / SA when not overridden
  useEffect(() => {
    if (!termOption) return;
    if (!overrideBonus) {
      setBonusPerThousand(getPlanBonusRate(planId, termOption.term, sumAssured));
    }
    if (!overrideFab) {
      setFabPerThousand(getDefaultFab(termOption.term));
    }
    if (planId !== "custom") {
      setCustomPpt(termOption.ppt);
    }
  }, [planId, termOption, sumAssured, overrideBonus, overrideFab]);

  const policyTerm = termOption?.term ?? 25;
  const ppt = planId === "custom" ? customPpt : termOption?.ppt ?? policyTerm;

  const result = useMemo(() => {
    const yearsToMaturity = Math.max(0, policyTerm - yearsElapsed);
    const maturityYear = startYear + policyTerm;
    const saOnMaturity = sumAssured * plan.maturitySaFactor;
    const vestedBonus = (bonusPerThousand * sumAssured) / 1000 * policyTerm;
    const fab = (fabPerThousand * sumAssured) / 1000;
    const maturityAmount = saOnMaturity + vestedBonus + fab;
    const interimMoneyBack =
      plan.moneyBackPct && plan.moneyBackPct > 0 ? (sumAssured * plan.moneyBackPct) / 100 : 0;
    const totalPremiums = annualPremium * ppt;
    const lifetimeCash =
      maturityAmount + (plan.category === "Money back" || plan.moneyBackPct ? interimMoneyBack : 0);
    const gainVsPremiums = lifetimeCash - totalPremiums;

    return {
      yearsToMaturity,
      maturityYear,
      saOnMaturity,
      vestedBonus,
      fab,
      maturityAmount,
      interimMoneyBack,
      totalPremiums,
      lifetimeCash,
      gainVsPremiums,
    };
  }, [
    policyTerm,
    yearsElapsed,
    startYear,
    sumAssured,
    plan.maturitySaFactor,
    plan.moneyBackPct,
    plan.category,
    bonusPerThousand,
    fabPerThousand,
    annualPremium,
    ppt,
  ]);

  return (
    <div className="space-y-6">
      <div className="glass-card space-y-4 p-6">
        <h3 className="font-semibold text-theme-heading">{t("selectLicPlan")}</h3>
        <div>
          <label className="mb-1 block text-xs text-theme-subtle">{t("plan")}</label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value as LicPlanId)}
            className="input-field"
          >
            {LIC_PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.planNumber}) — {p.category}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-theme-muted">{plan.blurb}</p>
        <div>
          <label className="mb-1 block text-xs text-theme-subtle">{t("policyTermPpt")}</label>
          <select
            value={termIndex}
            onChange={(e) => setTermIndex(Number(e.target.value))}
            className="input-field"
          >
            {plan.terms.map((termOpt, i) => (
              <option key={`${termOpt.term}-${termOpt.ppt}`} value={i}>
                {termOpt.label}
              </option>
            ))}
          </select>
        </div>
        {planId === "custom" && (
          <CalculatorSlider label={t("customPptYears")} value={customPpt} min={1} max={40} step={1} unit=" yrs" onChange={setCustomPpt} />
        )}
        <div className="rounded-xl border border-theme bg-theme-surface/50 p-3 text-xs text-theme-subtle">
          <p>
            <span className="font-semibold text-theme-heading">Plan rules applied:</span> Term {policyTerm} yrs · PPT{" "}
            {ppt} yrs · Maturity SA factor {(plan.maturitySaFactor * 100).toFixed(0)}% of basic SA
            {plan.moneyBackPct ? ` · Interim money-back ~${plan.moneyBackPct}% of SA` : ""}
          </p>
          <p className="mt-1">{plan.notes}</p>
        </div>
      </div>

      <div className="glass-card space-y-4 p-6">
        <h3 className="font-semibold text-theme-heading">{t("yourPolicyNumbers")}</h3>
        <CalculatorSlider
          label={t("basicSumAssured")}
          value={sumAssured}
          min={plan.minSumAssured}
          max={10000000}
          step={25000}
          prefix="₹"
          onChange={setSumAssured}
        />
        <CalculatorSlider
          label={planId === "single-premium-endowment-717" ? t("singlePremium") : t("annualPremium")}
          value={annualPremium}
          min={5000}
          max={500000}
          step={1000}
          prefix="₹"
          onChange={setAnnualPremium}
        />
        <CalculatorSlider
          label={t("yearsAlreadyElapsed")}
          value={yearsElapsed}
          min={0}
          max={Math.max(policyTerm - 1, 0)}
          step={1}
          unit=" yrs"
          onChange={setYearsElapsed}
        />
        <CalculatorSlider
          label={t("policyStartYear")}
          value={startYear}
          min={1980}
          max={new Date().getFullYear()}
          step={1}
          onChange={setStartYear}
        />
      </div>

      <div className="glass-card space-y-4 p-6">
        <h3 className="font-semibold text-theme-heading">{t("bonusRates")}</h3>
        <p className="text-sm text-theme-muted">
          Auto-filled from illustrative published-style bands for this plan, term, and sum-assured slab. Override if your
          bonus statement differs.
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={overrideBonus} onChange={(e) => setOverrideBonus(e.target.checked)} />
          Override reversionary bonus rate
        </label>
        <CalculatorSlider
          label="Reversionary bonus (₹ / 1000 SA / year)"
          value={bonusPerThousand}
          min={0}
          max={80}
          step={1}
          prefix="₹"
          onChange={(v) => {
            setOverrideBonus(true);
            setBonusPerThousand(v);
          }}
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-theme-muted">
          <input type="checkbox" checked={overrideFab} onChange={(e) => setOverrideFab(e.target.checked)} />
          Override Final Additional Bonus (FAB)
        </label>
        <CalculatorSlider
          label="FAB (₹ / 1000 SA, once at maturity)"
          value={fabPerThousand}
          min={0}
          max={120}
          step={1}
          prefix="₹"
          onChange={(v) => {
            setOverrideFab(true);
            setFabPerThousand(v);
          }}
        />
      </div>

      <KPIStrip
        items={[
          { label: t("estimatedMaturityPayout"), value: fmt(result.maturityAmount), highlight: true },
          { label: t("yearsToMaturity"), value: `${result.yearsToMaturity}` },
          { label: t("maturityYear"), value: `${result.maturityYear}` },
        ]}
      />
      <KPIStrip
        items={[
          { label: t("saOnMaturity"), value: fmt(result.saOnMaturity) },
          { label: t("vestedBonus"), value: fmt(result.vestedBonus) },
          { label: t("fab"), value: fmt(result.fab) },
          { label: t("totalPremiums"), value: fmt(result.totalPremiums) },
        ]}
      />
      {result.interimMoneyBack > 0 && (
        <KPIStrip
          items={[
            { label: "Est. interim money-back (lifetime)", value: fmt(result.interimMoneyBack) },
            { label: "Maturity + money-back total", value: fmt(result.lifetimeCash), highlight: true },
            { label: "Gain vs premiums", value: fmt(result.gainVsPremiums) },
          ]}
        />
      )}
      {result.interimMoneyBack === 0 && (
        <KPIStrip items={[{ label: t("gainVsPremiums"), value: fmt(result.gainVsPremiums), highlight: true }]} />
      )}

      <div className="rounded-2xl border border-theme bg-theme-surface/60 p-5 text-sm text-theme-muted">
        <p className="font-semibold text-theme-heading">
          {plan.name} · Plan {plan.planNumber}
        </p>
        <p className="mt-2">
          Maturity ≈ SA on maturity ({fmt(result.saOnMaturity)}) + reversionary bonus @ ₹{bonusPerThousand}/1000 ×{" "}
          {policyTerm} yrs ({fmt(result.vestedBonus)}) + FAB @ ₹{fabPerThousand}/1000 ({fmt(result.fab)}).
        </p>
        <p className="mt-2 text-xs text-theme-subtle">
          Educational estimate using plan structure and illustrative bonus bands — not a live LIC policy lookup and not
          guaranteed. Actual bonuses/FAB change yearly. Confirm on the LIC portal or with your branch. Add this maturity
          amount into the{" "}
          <Link href="/tools/swp" className="text-accent hover:underline">
            SWP calculator
          </Link>{" "}
          as a future corpus top-up.
        </p>
      </div>
    </div>
  );
}
