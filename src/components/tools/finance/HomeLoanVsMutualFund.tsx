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
import AdvancedOptions from "@/components/ui/AdvancedOptions";
import { ToolSurface, ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ScenarioCompare } from "@/components/tools/viz";
import { simulateHomeLoanVsSip, type HousingOccupancy } from "@/lib/finance/homeLoanVsSip";
import {
  suggestedMonthlyRent,
  typicalStampDutyPercent,
  type CityHousingCagr,
} from "@/lib/finance/cityHousingCagr";
import { CityHousingCagrTable, CityHousingSelect } from "@/components/tools/finance/CityHousingCagrUi";
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

const PRESETS = [
  { id: "conservative", label: "Cautious", appreciation: 3, mf: 10 },
  { id: "base", label: "Base", appreciation: 5, mf: 12 },
  { id: "optimistic", label: "Optimistic", appreciation: 8, mf: 15 },
] as const;

export default function HomeLoanVsMutualFund({
  defaultOccupancy = "rent_out",
}: {
  defaultOccupancy?: HousingOccupancy;
}) {
  const [occupancy, setOccupancy] = useState<HousingOccupancy>(defaultOccupancy);
  const [cityId, setCityId] = useState("");
  const [propertyPrice, setPropertyPrice] = useState(75_00_000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [horizonYears, setHorizonYears] = useState(20);
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
  const [vacancyPercent, setVacancyPercent] = useState(defaultOccupancy === "rent_out" ? 8 : 0);
  const [stampDutyPercent, setStampDutyPercent] = useState(0);
  const [otherClosingPercent, setOtherClosingPercent] = useState(0);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(0);
  const [homeInsuranceMonthly, setHomeInsuranceMonthly] = useState(0);
  const [rentalIncomeTaxPercent, setRentalIncomeTaxPercent] = useState(0);
  const [sellingCostPercent, setSellingCostPercent] = useState(2);
  const [assumeSellAtEnd, setAssumeSellAtEnd] = useState(false);
  const [applyCityRent, setApplyCityRent] = useState(true);

  const applyCity = (city: CityHousingCagr | null) => {
    if (!city) {
      setCityId("");
      return;
    }
    setCityId(city.id);
    setAppreciationRate(city.cagr10y);
    setStampDutyPercent(typicalStampDutyPercent(city.country));
    if (applyCityRent) {
      setMonthlyRent(suggestedMonthlyRent(propertyPrice, city.rentYieldPct));
    }
  };

  const result = useMemo(
    () =>
      simulateHomeLoanVsSip({
        propertyPrice,
        downPaymentPercent,
        loanRate,
        tenureYears,
        horizonYears,
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
        occupancy,
        vacancyPercent: occupancy === "rent_out" ? vacancyPercent : 0,
        stampDutyPercent,
        otherClosingPercent,
        propertyTaxAnnual,
        homeInsuranceMonthly,
        rentalIncomeTaxPercent: occupancy === "rent_out" ? rentalIncomeTaxPercent : 0,
        sellingCostPercent,
        assumeSellAtEnd,
      }),
    [
      propertyPrice,
      downPaymentPercent,
      loanRate,
      tenureYears,
      horizonYears,
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
      occupancy,
      vacancyPercent,
      stampDutyPercent,
      otherClosingPercent,
      propertyTaxAnnual,
      homeInsuranceMonthly,
      rentalIncomeTaxPercent,
      sellingCostPercent,
      assumeSellAtEnd,
    ]
  );

  const housingWins = result.winner === "housing";
  const sipWins = result.winner === "sip";
  const liveIn = occupancy === "self_occupy";

  return (
    <div className="space-y-6">
      <ToolWorkspace>
        <div className="space-y-4">
          <ToolSurface title="Your situation" hint="Two real-life paths, same cash">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOccupancy("self_occupy")}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                  liveIn ? "border-accent/40 bg-accent/10" : "border-theme-subtle hover:border-accent/25"
                )}
              >
                <span className="block font-semibold text-theme-heading">Live in the home</span>
                <span className="mt-0.5 block text-xs text-theme-muted">Buy vs rent a similar home + SIP</span>
              </button>
              <button
                type="button"
                onClick={() => setOccupancy("rent_out")}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                  !liveIn ? "border-accent/40 bg-accent/10" : "border-theme-subtle hover:border-accent/25"
                )}
              >
                <span className="block font-semibold text-theme-heading">Buy to rent out</span>
                <span className="mt-0.5 block text-xs text-theme-muted">Investment property vs SIP</span>
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setAppreciationRate(p.appreciation);
                    setMfReturnRate(p.mf);
                    setCityId("");
                  }}
                  className="rounded-full border border-theme-subtle px-3 py-1 text-xs font-medium text-theme-body hover:border-accent/40"
                >
                  {p.label}: {p.appreciation}% home / {p.mf}% MF
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <CityHousingSelect value={cityId} onChange={applyCity} />
              <ToggleSwitch
                checked={applyCityRent}
                onChange={setApplyCityRent}
                label="When a city is picked, also set rent from typical yield"
                description="Rent = price × city gross yield / 12. You can still edit the rent slider after."
              />
            </div>
          </ToolSurface>

          <ToolSurface title="Home on loan" hint={liveIn ? "You live here" : "Buy, finance, rent it out"}>
            <div className="space-y-6">
              <CalculatorSlider
                label="Property price"
                value={propertyPrice}
                min={10_00_000}
                max={20_00_00_000}
                step={50_000}
                prefix="₹"
                onChange={(v) => {
                  setPropertyPrice(v);
                }}
              />
              <CalculatorSlider
                label="Down payment"
                value={downPaymentPercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                onChange={setDownPaymentPercent}
              />
              <p className="text-xs text-theme-muted">
                Down payment {fmt(result.downPayment)}
                {result.closingCosts > 0 ? ` · Closing ${fmt(result.closingCosts)}` : ""} · Loan {fmt(result.loanAmount)}
              </p>
              <CalculatorSlider
                label="Home loan rate"
                value={loanRate}
                min={0}
                max={20}
                step={0.1}
                unit="%"
                onChange={setLoanRate}
              />
              <CalculatorSlider
                label="Loan tenure"
                value={tenureYears}
                min={1}
                max={30}
                step={1}
                unit=" yrs"
                onChange={setTenureYears}
              />
              <CalculatorSlider
                label="Compare over"
                value={horizonYears}
                min={1}
                max={40}
                step={1}
                unit=" yrs"
                onChange={setHorizonYears}
              />
              <CalculatorSlider
                label="Property CAGR / year"
                value={appreciationRate}
                min={-10}
                max={30}
                step={0.1}
                unit="%"
                onChange={(v) => {
                  setAppreciationRate(v);
                  setCityId("");
                }}
              />
            </div>
          </ToolSurface>

          <ToolSurface title={liveIn ? "Rent you would pay instead" : "Rent & running costs"}>
            <div className="space-y-6">
              <CalculatorSlider
                label={liveIn ? "Comparable monthly rent" : "Starting monthly rent"}
                value={monthlyRent}
                min={0}
                max={10_00_000}
                step={1_000}
                prefix="₹"
                onChange={setMonthlyRent}
              />
              <CalculatorSlider
                label={liveIn ? "Rent increase / year" : "Rent increase / year"}
                value={rentIncrementPercent}
                min={0}
                max={20}
                step={0.5}
                unit="%"
                onChange={setRentIncrementPercent}
              />
              {!liveIn && (
                <CalculatorSlider
                  label="Vacancy / year"
                  value={vacancyPercent}
                  min={0}
                  max={50}
                  step={1}
                  unit="%"
                  onChange={setVacancyPercent}
                />
              )}
              <CalculatorSlider
                label="Monthly maintenance"
                value={monthlyMaintenance}
                min={0}
                max={2_00_000}
                step={500}
                prefix="₹"
                onChange={setMonthlyMaintenance}
              />
              <CalculatorSlider
                label="Monthly utilities"
                value={monthlyUtility}
                min={0}
                max={2_00_000}
                step={500}
                prefix="₹"
                onChange={setMonthlyUtility}
              />
              <CalculatorSlider
                label="Cost increase / year"
                value={expenseIncrementPercent}
                min={0}
                max={20}
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
                min={0}
                max={30}
                step={0.5}
                unit="%"
                onChange={setMfReturnRate}
              />
              <ToggleSwitch
                checked={matchSipToNetOutflow}
                onChange={setMatchSipToNetOutflow}
                label={liveIn ? "Match SIP to extra housing cash" : "Match SIP to monthly housing cash"}
                description={
                  liveIn
                    ? "Each month the renter invests max(0, EMI + costs − rent they would have paid). Fair apples-to-apples cash."
                    : "Each month the SIP equals EMI + costs − rent received. When rent covers costs, SIP that month is ₹0."
                }
              />
              {!matchSipToNetOutflow && (
                <CalculatorSlider
                  label="Fixed monthly SIP"
                  value={customMonthlySip}
                  min={0}
                  max={10_00_000}
                  step={1_000}
                  prefix="₹"
                  onChange={setCustomMonthlySip}
                />
              )}
              <ToggleSwitch
                checked={investDownPaymentInSip}
                onChange={setInvestDownPaymentInSip}
                label="Invest down payment + closing costs as a lump sum"
                description="Money not used to buy (including stamp duty) starts in the mutual fund on day one."
              />
              <ToggleSwitch
                checked={investPropertySurplus}
                onChange={setInvestPropertySurplus}
                label={liveIn ? "Invest leftover vs rent" : "Invest rental surplus"}
                description={
                  liveIn
                    ? "If renting would have cost more than EMI + costs, that leftover is invested on the home path."
                    : "If rent exceeds EMI + costs, that surplus is invested at the same MF return in the home scenario."
                }
              />
              <ToggleSwitch
                checked={assumeSellAtEnd}
                onChange={setAssumeSellAtEnd}
                label="Assume you sell the home at the horizon"
                description={`Net of ${sellingCostPercent}% selling costs (brokerage). Leave off to keep the home marked to market.`}
              />
            </div>
          </ToolSurface>

          <AdvancedOptions>
            <CalculatorSlider
              label="Stamp duty / registration"
              value={stampDutyPercent}
              min={0}
              max={15}
              step={0.1}
              unit="%"
              onChange={setStampDutyPercent}
            />
            <CalculatorSlider
              label="Other closing costs"
              value={otherClosingPercent}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              onChange={setOtherClosingPercent}
            />
            <CalculatorSlider
              label="Annual property tax"
              value={propertyTaxAnnual}
              min={0}
              max={10_00_000}
              step={1_000}
              prefix="₹"
              onChange={setPropertyTaxAnnual}
            />
            <CalculatorSlider
              label="Home insurance / month"
              value={homeInsuranceMonthly}
              min={0}
              max={50_000}
              step={100}
              prefix="₹"
              onChange={setHomeInsuranceMonthly}
            />
            {!liveIn && (
              <CalculatorSlider
                label="Tax on rental income"
                value={rentalIncomeTaxPercent}
                min={0}
                max={40}
                step={1}
                unit="%"
                onChange={setRentalIncomeTaxPercent}
              />
            )}
            <CalculatorSlider
              label="Selling costs if sold"
              value={sellingCostPercent}
              min={0}
              max={10}
              step={0.5}
              unit="%"
              onChange={setSellingCostPercent}
            />
          </AdvancedOptions>
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
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-subtle">
                  After {horizonYears} years
                </p>
                <p className="mt-1 text-lg font-bold text-theme-heading sm:text-xl">
                  {result.winner === "tie"
                    ? "Both paths finish about even"
                    : housingWins
                      ? liveIn
                        ? "Buying to live is ahead"
                        : "Home loan path ahead"
                      : "Mutual fund SIP ahead"}
                </p>
                <p className="mt-1 text-sm text-theme-muted">
                  {result.winner === "tie"
                    ? "Net worth is effectively the same under these assumptions."
                    : `${housingWins ? "Owning the home" : "Staying invested"} leads by ${fmt(Math.abs(result.advantage))}.`}
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
                  {assumeSellAtEnd ? "If sold − loan + surplus" : "Property − loan + surplus"}
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
              {
                label: "This month’s SIP",
                value: fmt(matchSipToNetOutflow ? result.firstMonthMatchedSip : customMonthlySip),
              },
              { label: liveIn ? "Home cash this month" : "Net housing cash", value: fmt(result.firstMonthNetOutflow) },
              { label: "Upfront cash", value: fmt(result.upfrontCash) },
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
              { label: "Upfront", a: fmt(result.upfrontCash), b: investDownPaymentInSip ? fmt(result.upfrontCash) : "—" },
              { label: "EMI paid", a: fmt(result.totalEmiPaid), b: "—" },
              {
                label: liveIn ? "Rent avoided (not cash)" : "Rent received",
                a: liveIn ? fmt(result.firstMonthComparableRent) + "/mo start" : fmt(result.totalRentReceived),
                b: "—",
              },
              { label: "Maint. + tax + insurance", a: fmt(result.totalExpenses), b: "—" },
              { label: "SIP contributions", a: "—", b: fmt(result.totalSipInvested) },
              { label: "Interest paid", a: fmt(result.totalInterest), b: "—" },
              { label: "Property value", a: fmt(result.endingPropertyValue), b: "—" },
              { label: "Loan left", a: fmt(result.endingLoanOutstanding), b: "—" },
              { label: "Keep-home net worth", a: fmt(result.housingNetWorthKeep), b: fmt(result.sipCorpus) },
              { label: "If sold (after costs)", a: fmt(result.housingNetWorthIfSold), b: fmt(result.sipCorpus) },
              { label: "Rental / leftover corpus", a: fmt(result.surplusCorpus), b: "—" },
            ]}
          />

          <ToolSurface title="City housing CAGRs (last ~10 years)">
            <CityHousingCagrTable selectedId={cityId || undefined} onPick={applyCity} />
            <p className="mt-3 text-xs leading-relaxed text-theme-muted">
              Indicative city-average nominal price CAGR, not a guarantee. Click a row to load it. Pair with your own
              price, rent, and costs.
            </p>
          </ToolSurface>

          <p className="px-1 text-xs leading-relaxed text-theme-muted">
            Month 1: EMI {fmt(result.emi)} + costs {fmt(result.firstMonthExpenses)}
            {liveIn
              ? ` vs rent ${fmt(result.firstMonthComparableRent)}`
              : ` − rent ${fmt(result.firstMonthRent)}`}{" "}
            → housing cash {fmt(result.firstMonthNetOutflow)}. Estimates omit capital-gains tax detail, furnished vs
            unfurnished gaps, and lender rules. Not financial advice.
          </p>
        </div>
      </ToolWorkspace>
    </div>
  );
}
