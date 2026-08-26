"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { ToolSurface, ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ScenarioCompare } from "@/components/tools/viz";
import { simulateHomeLoanVsSip } from "@/lib/finance/homeLoanVsSip";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Home, TrendingUp } from "lucide-react";

function fmt(n: number): string {
  return formatCurrency(Math.round(n));
}

function axisFmt(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000) return `₹${(v / 1_00_000).toFixed(0)}L`;
  return `₹${Math.round(v / 1000)}k`;
}

export default function HomeLoanVsMutualFund() {
  const [propertyPrice, setPropertyPrice] = useState(75_00_000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [rentIncrementPercent, setRentIncrementPercent] = useState(5);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(4_000);
  const [monthlyUtility, setMonthlyUtility] = useState(3_000);
  const [expenseIncrementPercent, setExpenseIncrementPercent] = useState(5);
  const [mfReturnRate, setMfReturnRate] = useState(12);
  const [matchSipToNetOutflow, setMatchSipToNetOutflow] = useState(true);
  const [customMonthlySip, setCustomMonthlySip] = useState(35_000);
  const [investDownPaymentInSip, setInvestDownPaymentInSip] = useState(true);
  const [investPropertySurplus, setInvestPropertySurplus] = useState(true);

  const result = useMemo(
    () =>
      simulateHomeLoanVsSip({
        propertyPrice,
        downPaymentPercent,
        loanRate,
        tenureYears,
        appreciationRate,
        monthlyRent,
        rentIncrementPercent,
        monthlyMaintenance,
        monthlyUtility,
        expenseIncrementPercent,
        mfReturnRate,
        matchSipToNetOutflow,
        customMonthlySip,
        investDownPaymentInSip,
        investPropertySurplus,
      }),
    [
      propertyPrice,
      downPaymentPercent,
      loanRate,
      tenureYears,
      appreciationRate,
      monthlyRent,
      rentIncrementPercent,
      monthlyMaintenance,
      monthlyUtility,
      expenseIncrementPercent,
      mfReturnRate,
      matchSipToNetOutflow,
      customMonthlySip,
      investDownPaymentInSip,
      investPropertySurplus,
    ]
  );

  const housingWins = result.winner === "housing";
  const sipWins = result.winner === "sip";

  return (
    <div className="space-y-6">
      <ToolWorkspace>
        <div className="space-y-4">
          <ToolSurface title="Home on loan" hint="Buy, finance, rent it out">
            <div className="space-y-6">
              <CalculatorSlider
                label="Property price"
                value={propertyPrice}
                min={10_00_000}
                max={10_00_00_000}
                step={50_000}
                prefix="₹"
                onChange={setPropertyPrice}
              />
              <CalculatorSlider
                label="Down payment"
                value={downPaymentPercent}
                min={10}
                max={50}
                step={1}
                unit="%"
                onChange={setDownPaymentPercent}
              />
              <p className="text-xs text-theme-muted">
                Down payment {fmt(result.downPayment)} · Loan {fmt(result.loanAmount)}
              </p>
              <CalculatorSlider
                label="Home loan rate"
                value={loanRate}
                min={6}
                max={14}
                step={0.1}
                unit="%"
                onChange={setLoanRate}
              />
              <CalculatorSlider
                label="Loan tenure"
                value={tenureYears}
                min={5}
                max={30}
                step={1}
                unit=" yrs"
                onChange={setTenureYears}
              />
              <CalculatorSlider
                label="Property appreciation / year"
                value={appreciationRate}
                min={0}
                max={12}
                step={0.5}
                unit="%"
                onChange={setAppreciationRate}
              />
            </div>
          </ToolSurface>

          <ToolSurface title="Rent & running costs">
            <div className="space-y-6">
              <CalculatorSlider
                label="Starting monthly rent"
                value={monthlyRent}
                min={0}
                max={3_00_000}
                step={1_000}
                prefix="₹"
                onChange={setMonthlyRent}
              />
              <CalculatorSlider
                label="Rent increase / year"
                value={rentIncrementPercent}
                min={0}
                max={15}
                step={0.5}
                unit="%"
                onChange={setRentIncrementPercent}
              />
              <CalculatorSlider
                label="Monthly maintenance"
                value={monthlyMaintenance}
                min={0}
                max={50_000}
                step={500}
                prefix="₹"
                onChange={setMonthlyMaintenance}
              />
              <CalculatorSlider
                label="Monthly utilities"
                value={monthlyUtility}
                min={0}
                max={50_000}
                step={500}
                prefix="₹"
                onChange={setMonthlyUtility}
              />
              <CalculatorSlider
                label="Cost increase / year"
                value={expenseIncrementPercent}
                min={0}
                max={15}
                step={0.5}
                unit="%"
                onChange={setExpenseIncrementPercent}
              />
            </div>
          </ToolSurface>

          <ToolSurface title="Mutual fund SIP" hint="Same cash, invested">
            <div className="space-y-4">
              <CalculatorSlider
                label="Expected MF return / year"
                value={mfReturnRate}
                min={6}
                max={18}
                step={0.5}
                unit="%"
                onChange={setMfReturnRate}
              />
              <ToggleSwitch
                checked={matchSipToNetOutflow}
                onChange={setMatchSipToNetOutflow}
                label="Match SIP to monthly housing cash"
                description="Each month the SIP equals EMI + maintenance + utilities − rent. When rent covers costs, SIP that month is ₹0."
              />
              {!matchSipToNetOutflow && (
                <CalculatorSlider
                  label="Fixed monthly SIP"
                  value={customMonthlySip}
                  min={0}
                  max={2_00_000}
                  step={1_000}
                  prefix="₹"
                  onChange={setCustomMonthlySip}
                />
              )}
              <ToggleSwitch
                checked={investDownPaymentInSip}
                onChange={setInvestDownPaymentInSip}
                label="Invest the down payment as a lump sum"
                description="Fair start: money not used as down payment goes into the mutual fund on day one."
              />
              <ToggleSwitch
                checked={investPropertySurplus}
                onChange={setInvestPropertySurplus}
                label="Invest rental surplus"
                description="If rent exceeds EMI + costs, that surplus is invested at the same MF return in the home scenario."
              />
            </div>
          </ToolSurface>
        </div>

        <div className="space-y-4 lg:sticky lg:top-[calc(var(--nav-height)+1rem)]">
          <div
            className={cn(
              "tool-surface overflow-hidden p-0",
              housingWins && "ring-1 ring-accent/30",
              sipWins && "ring-1 ring-blue-400/30"
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-theme-subtle px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-subtle">After {tenureYears} years</p>
                <p className="mt-1 text-lg font-bold text-theme-heading sm:text-xl">
                  {result.winner === "tie"
                    ? "Both paths finish about even"
                    : housingWins
                      ? "Home loan path ahead"
                      : "Mutual fund SIP ahead"}
                </p>
                <p className="mt-1 text-sm text-theme-muted">
                  {result.winner === "tie"
                    ? "Net worth is effectively the same under these assumptions."
                    : `${housingWins ? "Owning the rented home" : "Staying invested"} leads by ${fmt(Math.abs(result.advantage))}.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0">
              <div className="border-r border-theme-subtle p-5 sm:p-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  <Home className="h-3.5 w-3.5" /> Home
                </p>
                <p className="mt-2 break-all text-2xl font-bold tabular-nums text-theme-heading sm:text-3xl">
                  {formatCompactCurrency(result.housingNetWorth)}
                </p>
                <p className="mt-1 text-xs text-theme-muted" title={fmt(result.housingNetWorth)}>
                  Property − loan + surplus
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-500">
                  <TrendingUp className="h-3.5 w-3.5" /> SIP
                </p>
                <p className="mt-2 break-all text-2xl font-bold tabular-nums text-theme-heading sm:text-3xl">
                  {formatCompactCurrency(result.sipCorpus)}
                </p>
                <p className="mt-1 text-xs text-theme-muted" title={fmt(result.sipCorpus)}>
                  Corpus from matched cash
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Monthly EMI", value: fmt(result.emi) },
              { label: "This month’s SIP", value: fmt(matchSipToNetOutflow ? result.firstMonthMatchedSip : customMonthlySip) },
              { label: "Net housing cash", value: fmt(result.firstMonthNetOutflow) },
              { label: "Down payment", value: fmt(result.downPayment) },
            ].map((item) => (
              <div key={item.label} className="tool-surface px-3 py-3 sm:px-4">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-theme-subtle">{item.label}</p>
                <p className="mt-1 truncate text-sm font-bold tabular-nums text-theme-heading" title={item.value}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <ToolSurface title="Net worth over time">
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hl-home" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9B8A" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0D9B8A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hl-sip" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} stroke="#64748b" fontSize={11} />
                  <YAxis tickFormatter={axisFmt} stroke="#64748b" fontSize={11} width={52} />
                  <Tooltip
                    formatter={(value: number, name: string) => [fmt(value), name]}
                    labelFormatter={(y) => `Year ${y}`}
                    contentStyle={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="housingNetWorth"
                    name="Home"
                    stroke="#0D9B8A"
                    fill="url(#hl-home)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="sipCorpus"
                    name="SIP"
                    stroke="#3b82f6"
                    fill="url(#hl-sip)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ToolSurface>

          <ScenarioCompare
            title="Cash that actually moved"
            columnA="Home"
            columnB="SIP"
            rows={[
              { label: "Upfront", a: fmt(result.downPayment), b: investDownPaymentInSip ? fmt(result.downPayment) : "—" },
              { label: "EMI paid", a: fmt(result.totalEmiPaid), b: "—" },
              { label: "Rent received", a: fmt(result.totalRentReceived), b: "—" },
              { label: "Maint. + utilities", a: fmt(result.totalExpenses), b: "—" },
              { label: "SIP contributions", a: "—", b: fmt(result.totalSipInvested) },
              { label: "Interest paid", a: fmt(result.totalInterest), b: "—" },
              { label: "Property value", a: fmt(result.endingPropertyValue), b: "—" },
              { label: "Loan left", a: fmt(result.endingLoanOutstanding), b: "—" },
              { label: "Rental surplus corpus", a: fmt(result.surplusCorpus), b: "—" },
              { label: "Ending net worth", a: fmt(result.housingNetWorth), b: fmt(result.sipCorpus) },
            ]}
          />

          <p className="px-1 text-xs leading-relaxed text-theme-muted">
            Month 1 cash: EMI {fmt(result.emi)} + costs {fmt(result.firstMonthExpenses)} − rent {fmt(result.firstMonthRent)} ={" "}
            {fmt(result.firstMonthNetOutflow)}. Estimates ignore tax on rent, capital gains, vacancy, stamp duty, and
            prepayment. Not financial advice.
          </p>
        </div>
      </ToolWorkspace>
    </div>
  );
}
