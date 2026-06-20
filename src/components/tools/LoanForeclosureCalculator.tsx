"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import ResultCard from "@/components/tools/ResultCard";
import { formatCurrency, cn } from "@/lib/utils";

type Strategy = "continue" | "prepay_all" | "extra_yearly";

function calcEmi(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function amortizeSchedule(
  principal: number,
  annualRate: number,
  months: number,
  monthsPaid: number,
  extraYearly = 0
): {
  emi: number;
  outstanding: number;
  totalInterest: number;
  remainingInterest: number;
  monthsRemaining: number;
} {
  const r = annualRate / 12 / 100;
  const emi = calcEmi(principal, annualRate, months);
  let balance = principal;
  let totalInterest = 0;
  let month = 0;

  while (balance > 0.01 && month < months) {
    month++;
    const interest = balance * r;
    let principalPaid = emi - interest;
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    totalInterest += interest;

    if (month % 12 === 0 && extraYearly > 0 && balance > 0) {
      const extra = Math.min(extraYearly, balance);
      balance -= extra;
    }
  }

  const paidMonths = Math.min(monthsPaid, months);
  balance = principal;
  let interestPaidSoFar = 0;
  for (let m = 1; m <= paidMonths; m++) {
    const interest = balance * r;
    const principalPaid = Math.min(emi - interest, balance);
    balance -= principalPaid;
    interestPaidSoFar += interest;
    if (m % 12 === 0 && extraYearly > 0 && balance > 0) {
      balance -= Math.min(extraYearly, balance);
    }
  }

  const outstanding = Math.max(balance, 0);

  let remBalance = outstanding;
  let remainingInterest = 0;
  let remMonths = 0;
  while (remBalance > 0.01 && remMonths < months - paidMonths) {
    remMonths++;
    const interest = remBalance * r;
    const principalPaid = Math.min(emi - interest, remBalance);
    remBalance -= principalPaid;
    remainingInterest += interest;
    if ((paidMonths + remMonths) % 12 === 0 && extraYearly > 0 && remBalance > 0) {
      remBalance -= Math.min(extraYearly, remBalance);
    }
  }

  const fullSchedule = amortizeFull(principal, annualRate, months, extraYearly);
  return {
    emi,
    outstanding,
    totalInterest: fullSchedule.totalInterest,
    remainingInterest,
    monthsRemaining: remMonths,
  };
}

function amortizeFull(principal: number, annualRate: number, months: number, extraYearly = 0) {
  const r = annualRate / 12 / 100;
  const emi = calcEmi(principal, annualRate, months);
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  while (balance > 0.01 && month < months * 2) {
    month++;
    const interest = balance * r;
    const principalPaid = Math.min(emi - interest, balance);
    balance -= principalPaid;
    totalInterest += interest;
    if (month % 12 === 0 && extraYearly > 0 && balance > 0) {
      balance -= Math.min(extraYearly, balance);
    }
  }
  return { totalInterest, monthsToClose: month, emi };
}

export default function LoanForeclosureCalculator() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenureYears, setTenureYears] = useState(20);
  const [monthsPaid, setMonthsPaid] = useState(36);
  const [strategy, setStrategy] = useState<Strategy>("prepay_all");
  const [foreclosurePct, setForeclosurePct] = useState(2);
  const [foreclosureFlat, setForeclosureFlat] = useState(0);
  const [extraYearly, setExtraYearly] = useState(100000);
  const [useFlatCharge, setUseFlatCharge] = useState(false);

  const months = tenureYears * 12;

  const results = useMemo(() => {
    const baseline = amortizeSchedule(loanAmount, interestRate, months, monthsPaid, 0);
    const withExtra = amortizeSchedule(loanAmount, interestRate, months, monthsPaid, extraYearly);

    const foreclosureCharge = useFlatCharge
      ? foreclosureFlat
      : baseline.outstanding * (foreclosurePct / 100);

    const prepayTotal = baseline.outstanding + foreclosureCharge;
    const prepayBenefit = baseline.remainingInterest - foreclosureCharge;

    const extraBenefit = baseline.remainingInterest - withExtra.remainingInterest;
    const extraCost = extraYearly * Math.ceil((months - monthsPaid) / 12);

    return {
      emi: baseline.emi,
      outstanding: baseline.outstanding,
      remainingInterest: baseline.remainingInterest,
      totalInterestIfContinue: baseline.remainingInterest,
      foreclosureCharge,
      prepayTotal,
      prepayBenefit,
      interestSavedPrepay: baseline.remainingInterest,
      netBenefitPrepay: prepayBenefit,
      extraBenefit,
      extraRemainingInterest: withExtra.remainingInterest,
      extraMonthsSaved: baseline.monthsRemaining - withExtra.monthsRemaining,
      totalInterestFull: baseline.totalInterest,
    };
  }, [
    loanAmount,
    interestRate,
    tenureYears,
    monthsPaid,
    extraYearly,
    foreclosurePct,
    foreclosureFlat,
    useFlatCharge,
    months,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-6 p-6">
        <h2 className="text-xl font-bold text-theme-heading">Loan Details</h2>
        <CalculatorSlider label="Loan Amount" value={loanAmount} min={100000} max={50000000} step={50000} prefix="₹" onChange={setLoanAmount} />
        <CalculatorSlider label="Interest Rate" value={interestRate} min={5} max={18} step={0.1} unit="%" onChange={setInterestRate} />
        <CalculatorSlider label="Original Tenure" value={tenureYears} min={1} max={30} step={1} unit=" yrs" onChange={setTenureYears} />
        <CalculatorSlider label="EMIs Already Paid" value={monthsPaid} min={0} max={months - 1} step={1} unit=" mo" onChange={setMonthsPaid} />

        <div>
          <p className="mb-3 text-sm font-medium text-theme-body">Closure Strategy</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["prepay_all", "Prepay Full Balance"],
                ["extra_yearly", "Extra EMI Per Year"],
                ["continue", "Continue as-is"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStrategy(id)}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-medium",
                  strategy === id ? "bg-accent text-white" : "bg-theme-surface text-theme-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {strategy === "extra_yearly" && (
          <CalculatorSlider label="Extra Payment Per Year" value={extraYearly} min={10000} max={2000000} step={10000} prefix="₹" onChange={setExtraYearly} />
        )}

        {strategy === "prepay_all" && (
          <AdvancedOptions>
            <label className="flex items-center gap-2 text-sm text-theme-muted">
              <input type="checkbox" checked={useFlatCharge} onChange={(e) => setUseFlatCharge(e.target.checked)} className="accent-accent" />
              Use flat foreclosure charge instead of percentage
            </label>
            {useFlatCharge ? (
              <CalculatorSlider label="Foreclosure Charge (flat)" value={foreclosureFlat} min={0} max={500000} step={1000} prefix="₹" onChange={setForeclosureFlat} />
            ) : (
              <CalculatorSlider label="Foreclosure Charge (%)" value={foreclosurePct} min={0} max={5} step={0.25} unit="%" onChange={setForeclosurePct} />
            )}
          </AdvancedOptions>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Current EMI" value={results.emi} highlight />
          <ResultCard label="Outstanding Principal" value={results.outstanding} variant="emerald" />
          <ResultCard label="Remaining Interest (if continue)" value={results.remainingInterest} />
          <ResultCard label="Total Interest (full tenure)" value={results.totalInterestFull} />
        </div>

        {strategy === "prepay_all" && (
          <div className="glass-card space-y-4 p-6">
            <h3 className="font-semibold text-theme-heading">Full Prepayment Analysis</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Outstanding balance" value={results.outstanding} />
              <ResultCard label="Foreclosure charges" value={results.foreclosureCharge} />
              <ResultCard label="Total payout to close" value={results.prepayTotal} highlight />
              <ResultCard label="Interest saved" value={results.interestSavedPrepay} variant="emerald" />
              <ResultCard label="Net benefit (saved − charges)" value={results.netBenefitPrepay} variant={results.netBenefitPrepay >= 0 ? "emerald" : "blue"} />
            </div>
            <p className="text-sm text-theme-muted">
              {results.netBenefitPrepay >= 0
                ? `Closing now saves ${formatCurrency(results.netBenefitPrepay)} after foreclosure charges.`
                : `Foreclosure charges exceed interest savings by ${formatCurrency(Math.abs(results.netBenefitPrepay))}. Continuing may be cheaper.`}
            </p>
          </div>
        )}

        {strategy === "extra_yearly" && (
          <div className="glass-card space-y-4 p-6">
            <h3 className="font-semibold text-theme-heading">Extra Annual Payment Analysis</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Remaining interest (baseline)" value={results.remainingInterest} />
              <ResultCard label="Remaining interest (with extra)" value={results.extraRemainingInterest} highlight />
              <ResultCard label="Interest saved" value={results.extraBenefit} variant="emerald" />
              <div className="glass-card p-5 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Months saved (approx)</p>
                <p className="mt-2 text-2xl font-bold text-theme-heading">{results.extraMonthsSaved}</p>
              </div>
            </div>
            <p className="text-sm text-theme-muted">
              Paying {formatCurrency(extraYearly)} extra each year saves {formatCurrency(results.extraBenefit)} in interest
              without foreclosure penalties.
            </p>
          </div>
        )}

        {strategy === "continue" && (
          <div className="glass-card p-6">
            <p className="text-sm text-theme-muted">
              If you continue paying EMI for the remaining tenure, you will pay approximately{" "}
              <strong className="text-theme-heading">{formatCurrency(results.remainingInterest)}</strong> in additional interest
              on top of the outstanding principal of {formatCurrency(results.outstanding)}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
