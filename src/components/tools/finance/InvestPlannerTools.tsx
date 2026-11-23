"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { GrowthChart, KPIStrip } from "@/components/tools/viz";
import { Panel, Segmented, ToolNote, ToolStack, ghostButton } from "@/components/tools/kit";
import { sipFutureValue } from "@/lib/finance/sipProjection";
import {
  fireProjection,
  homeLoanEligibility,
  lumpsumGrowth,
  presentValue,
  requiredLumpsum,
  requiredMonthlySip,
  sharesToReachAverage,
  stockAverage,
  xirr,
  type CashFlow,
} from "@/lib/plannerMath";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

const yearTick = (v: number | string) => `Yr ${v}`;

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */

export function StepUpSipTool() {
  const [monthly, setMonthly] = useState(10000);
  const [stepUp, setStepUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const stepped = sipFutureValue({ monthlyInvestment: monthly, annualReturnPct: rate, years, stepUpPercent: stepUp });
    const flat = sipFutureValue({ monthlyInvestment: monthly, annualReturnPct: rate, years });
    const chart = stepped.chart.map((point, i) => ({
      year: point.year,
      stepUp: Math.round(point.value),
      flat: Math.round(flat.chart[i]?.value ?? 0),
      invested: Math.round(point.invested),
    }));
    const finalMonthly = monthly * Math.pow(1 + stepUp / 100, Math.max(0, years - 1));
    return { stepped, flat, chart, finalMonthly };
  }, [monthly, stepUp, rate, years]);

  return (
    <ToolStack>
      <CalculatorSlider label="Monthly SIP (year 1)" value={monthly} min={500} max={1_000_000} step={500} prefix="₹" onChange={setMonthly} />
      <CalculatorSlider label="Annual step-up" value={stepUp} min={0} max={50} step={1} unit="%" onChange={setStepUp} />
      <CalculatorSlider label="Expected return (p.a.)" value={rate} min={1} max={30} step={0.5} unit="%" onChange={setRate} />
      <CalculatorSlider label="Investment period" value={years} min={1} max={40} step={1} unit=" yrs" onChange={setYears} />
      <KPIStrip
        items={[
          { label: "Corpus with step-up", value: formatCompactCurrency(result.stepped.futureValue), highlight: true },
          { label: "Total invested", value: formatCompactCurrency(result.stepped.totalInvested) },
          { label: "Wealth gained", value: formatCompactCurrency(result.stepped.futureValue - result.stepped.totalInvested) },
          {
            label: "Extra vs flat SIP",
            value: formatCompactCurrency(result.stepped.futureValue - result.flat.futureValue),
            hint: `Flat SIP: ${formatCompactCurrency(result.flat.futureValue)}`,
          },
        ]}
      />
      <GrowthChart
        ariaLabel="Step-up SIP corpus compared with a flat SIP and the amount invested, year by year"
        data={result.chart}
        xKey="year"
        formatX={yearTick}
        formatValue={formatCurrency}
        formatAxis={formatCompactCurrency}
        series={[
          { key: "stepUp", label: "Step-up SIP corpus" },
          { key: "flat", label: "Flat SIP corpus", tone: "emerald" },
          { key: "invested", label: "Invested (step-up)", tone: "muted" },
        ]}
      />
      <ToolNote>
        In the final year your SIP would be about {formatCurrency(result.finalMonthly)} a month. Returns are assumed constant and
        compounded monthly; real market returns vary. Illustrative only — not investment advice.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

export function LumpsumTool() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);

  const result = useMemo(() => lumpsumGrowth(principal, rate, years), [principal, rate, years]);
  const real = presentValue(result.futureValue, inflation, years);
  const multiple = principal > 0 ? result.futureValue / principal : 0;
  const chart = useMemo(
    () => result.chart.map((p) => ({ year: p.year, value: Math.round(p.value), invested: Math.round(p.invested) })),
    [result]
  );

  return (
    <ToolStack>
      <CalculatorSlider label="One-time investment" value={principal} min={1000} max={100_000_000} step={1000} prefix="₹" onChange={setPrincipal} />
      <CalculatorSlider label="Expected return (p.a.)" value={rate} min={1} max={30} step={0.5} unit="%" onChange={setRate} />
      <CalculatorSlider label="Holding period" value={years} min={1} max={40} step={1} unit=" yrs" onChange={setYears} />
      <CalculatorSlider label="Inflation (for today's value)" value={inflation} min={0} max={15} step={0.5} unit="%" onChange={setInflation} />
      <KPIStrip
        items={[
          { label: "Future value", value: formatCompactCurrency(result.futureValue), highlight: true },
          { label: "Wealth gained", value: formatCompactCurrency(result.gain) },
          { label: "Growth multiple", value: `${multiple.toFixed(2)}x` },
          { label: "In today's money", value: formatCompactCurrency(real), hint: `after ${inflation}% inflation` },
        ]}
      />
      <GrowthChart
        ariaLabel="Lumpsum investment value by year compared with the amount invested"
        data={chart}
        xKey="year"
        formatX={yearTick}
        formatValue={formatCurrency}
        formatAxis={formatCompactCurrency}
        series={[
          { key: "value", label: "Investment value" },
          { key: "invested", label: "Amount invested", tone: "muted" },
        ]}
      />
      <ToolNote>Annual compounding at a constant rate. Markets move in both directions — treat this as a planning estimate.</ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

export function GoalSipTool() {
  const [target, setTarget] = useState(10_000_000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [existing, setExisting] = useState(0);
  const [inflation, setInflation] = useState(6);
  const [todayMoney, setTodayMoney] = useState<"future" | "today">("future");

  const effectiveTarget = todayMoney === "today" ? target * Math.pow(1 + inflation / 100, years) : target;
  const sip = useMemo(
    () => requiredMonthlySip({ target: effectiveTarget, annualReturnPct: rate, years, existingCorpus: existing }),
    [effectiveTarget, rate, years, existing]
  );
  const oneTime = Math.max(0, requiredLumpsum(effectiveTarget, rate, years) - existing);

  return (
    <ToolStack>
      <Segmented
        label="How is the goal amount expressed"
        value={todayMoney}
        onChange={setTodayMoney}
        options={[
          { value: "future", label: "Goal is the final amount" },
          { value: "today", label: "Goal is in today's prices" },
        ]}
      />
      <CalculatorSlider label="Goal amount" value={target} min={50_000} max={500_000_000} step={50_000} prefix="₹" onChange={setTarget} />
      <CalculatorSlider label="Time to goal" value={years} min={1} max={40} step={1} unit=" yrs" onChange={setYears} />
      <CalculatorSlider label="Expected return (p.a.)" value={rate} min={1} max={30} step={0.5} unit="%" onChange={setRate} />
      <CalculatorSlider label="Already saved for this goal" value={existing} min={0} max={100_000_000} step={10_000} prefix="₹" onChange={setExisting} />
      {todayMoney === "today" && (
        <CalculatorSlider label="Inflation" value={inflation} min={0} max={15} step={0.5} unit="%" onChange={setInflation} />
      )}
      <KPIStrip
        items={[
          { label: "Monthly SIP needed", value: formatCurrency(Math.ceil(sip.monthly)), highlight: true },
          { label: "You will invest", value: formatCompactCurrency(sip.totalInvested + existing) },
          { label: "Or invest once today", value: formatCompactCurrency(oneTime) },
          {
            label: "Target at the end",
            value: formatCompactCurrency(effectiveTarget),
            hint: todayMoney === "today" ? "inflation-adjusted" : undefined,
          },
        ]}
      />
      {sip.monthly === 0 && existing > 0 && (
        <p className="rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm text-theme-body">
          Your existing savings alone are projected to reach {formatCompactCurrency(sip.corpusFromExisting)} — enough for this goal
          at the assumed return.
        </p>
      )}
      <ToolNote>
        SIP is assumed at the start of each month with monthly compounding. Returns are not guaranteed — review the plan yearly.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

interface FlowRow {
  id: number;
  date: string;
  amount: string;
  kind: "out" | "in";
}

export function XirrTool() {
  const [rows, setRows] = useState<FlowRow[]>(() => [
    { id: 1, date: isoDaysAgo(730), amount: "100000", kind: "out" },
    { id: 2, date: isoDaysAgo(365), amount: "50000", kind: "out" },
    { id: 3, date: isoDaysAgo(180), amount: "25000", kind: "out" },
    { id: 4, date: isoDaysAgo(0), amount: "215000", kind: "in" },
  ]);
  const [nextId, setNextId] = useState(5);

  const update = (id: number, patch: Partial<FlowRow>) =>
    setRows((list) => list.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const { rate, invested, received } = useMemo(() => {
    const flows: CashFlow[] = [];
    let investedSum = 0;
    let receivedSum = 0;
    for (const row of rows) {
      const amount = Math.abs(Number(row.amount.replace(/,/g, "")));
      if (!row.date || !Number.isFinite(amount) || amount === 0) continue;
      if (row.kind === "out") investedSum += amount;
      else receivedSum += amount;
      flows.push({ date: row.date, amount: row.kind === "out" ? -amount : amount });
    }
    return { rate: xirr(flows), invested: investedSum, received: receivedSum };
  }, [rows]);

  const absolute = invested > 0 ? ((received - invested) / invested) * 100 : null;

  return (
    <ToolStack>
      <Panel
        title="Cash flows"
        action={
          <button
            type="button"
            className={ghostButton}
            onClick={() => {
              setRows((list) => [...list, { id: nextId, date: isoDaysAgo(0), amount: "", kind: "out" }]);
              setNextId((n) => n + 1);
            }}
          >
            <Plus className="h-4 w-4" /> Add row
          </button>
        }
      >
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[10.5rem_1fr_auto_auto] sm:items-center">
              <input
                type="date"
                aria-label="Date"
                className="input-field col-span-2 sm:col-span-1"
                value={row.date}
                onChange={(e) => update(row.id, { date: e.target.value })}
              />
              <input
                type="text"
                inputMode="decimal"
                aria-label="Amount"
                placeholder="Amount"
                className="input-field col-span-2 tabular-nums sm:col-span-1"
                value={row.amount}
                onChange={(e) => update(row.id, { amount: e.target.value.replace(/[^\d.,]/g, "") })}
              />
              <Segmented
                label="Direction"
                value={row.kind}
                onChange={(kind) => update(row.id, { kind })}
                options={[
                  { value: "out", label: "Invested" },
                  { value: "in", label: "Received" },
                ]}
              />
              <button
                type="button"
                aria-label="Remove row"
                className={`${ghostButton} h-11 w-11 justify-self-end !px-0`}
                disabled={rows.length <= 2}
                onClick={() => setRows((list) => list.filter((r) => r.id !== row.id))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Panel>
      <KPIStrip
        items={[
          { label: "XIRR (annualised)", value: rate === null ? "—" : `${(rate * 100).toFixed(2)}%`, highlight: true },
          { label: "Total invested", value: formatCompactCurrency(invested) },
          { label: "Total received", value: formatCompactCurrency(received) },
          { label: "Absolute return", value: absolute === null ? "—" : `${absolute.toFixed(2)}%` },
        ]}
      />
      {rate === null && (
        <p className="rounded-xl border border-theme-subtle bg-theme-surface p-4 text-sm text-theme-muted">
          Add at least one “Invested” row and one “Received” row on different dates. For a holding you still own, enter today&apos;s
          value as a “Received” row dated today.
        </p>
      )}
      <ToolNote>
        XIRR solves for the single yearly rate that makes all dated cash flows net to zero (365-day year), the same definition
        spreadsheets use. Taxes and exit loads are not included.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

interface LotRow {
  id: number;
  quantity: string;
  price: string;
}

const toNumber = (text: string) => {
  const n = Number(text.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export function StockAverageTool() {
  const [lots, setLots] = useState<LotRow[]>([
    { id: 1, quantity: "50", price: "1200" },
    { id: 2, quantity: "30", price: "1050" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [marketPrice, setMarketPrice] = useState(950);
  const [targetAverage, setTargetAverage] = useState(1050);

  const summary = useMemo(
    () => stockAverage(lots.map((lot) => ({ quantity: toNumber(lot.quantity), price: toNumber(lot.price) }))),
    [lots]
  );
  const needed = sharesToReachAverage(summary.totalQuantity, summary.averagePrice, marketPrice, targetAverage);
  const pnl = summary.totalQuantity * marketPrice - summary.totalCost;

  const update = (id: number, patch: Partial<LotRow>) =>
    setLots((list) => list.map((lot) => (lot.id === id ? { ...lot, ...patch } : lot)));

  return (
    <ToolStack>
      <Panel
        title="Your purchases"
        action={
          <button
            type="button"
            className={ghostButton}
            onClick={() => {
              setLots((list) => [...list, { id: nextId, quantity: "", price: "" }]);
              setNextId((n) => n + 1);
            }}
          >
            <Plus className="h-4 w-4" /> Add purchase
          </button>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_1fr_2.75rem] gap-2 text-xs font-medium uppercase tracking-[0.14em] text-theme-subtle" aria-hidden>
            <span>Quantity</span>
            <span>Price per share</span>
            <span />
          </div>
          {lots.map((lot, i) => (
            <div key={lot.id} className="grid grid-cols-[1fr_1fr_2.75rem] items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                aria-label={`Quantity for purchase ${i + 1}`}
                placeholder="Shares"
                className="input-field tabular-nums"
                value={lot.quantity}
                onChange={(e) => update(lot.id, { quantity: e.target.value.replace(/[^\d.,]/g, "") })}
              />
              <input
                type="text"
                inputMode="decimal"
                aria-label={`Price for purchase ${i + 1}`}
                placeholder="Price"
                className="input-field tabular-nums"
                value={lot.price}
                onChange={(e) => update(lot.id, { price: e.target.value.replace(/[^\d.,]/g, "") })}
              />
              <button
                type="button"
                aria-label={`Remove purchase ${i + 1}`}
                className={`${ghostButton} h-11 w-11 !px-0`}
                disabled={lots.length <= 1}
                onClick={() => setLots((list) => list.filter((l) => l.id !== lot.id))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Panel>
      <KPIStrip
        items={[
          { label: "Average price", value: summary.averagePrice.toLocaleString("en-IN", { maximumFractionDigits: 2 }), highlight: true },
          { label: "Total shares", value: summary.totalQuantity.toLocaleString("en-IN", { maximumFractionDigits: 4 }) },
          { label: "Total cost", value: summary.totalCost.toLocaleString("en-IN", { maximumFractionDigits: 2 }) },
        ]}
      />
      <Panel title="Average-down planner">
        <div className="space-y-5">
          <CalculatorSlider label="Current market price" value={marketPrice} min={1} max={100_000} step={1} onChange={setMarketPrice} />
          <CalculatorSlider label="Average price you want" value={targetAverage} min={1} max={100_000} step={1} onChange={setTargetAverage} />
          <KPIStrip
            items={[
              {
                label: "Shares to buy now",
                value: needed === null ? "Not reachable" : Math.ceil(needed).toLocaleString("en-IN"),
                highlight: needed !== null,
              },
              {
                label: "Cash required",
                value: needed === null ? "—" : (Math.ceil(needed) * marketPrice).toLocaleString("en-IN", { maximumFractionDigits: 0 }),
              },
              {
                label: "Unrealised P&L at market",
                value: `${pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
              },
            ]}
          />
          {needed === null && summary.totalQuantity > 0 && (
            <ToolNote>
              The target average must sit between the market price and your current average — buying at the market price can only pull
              your average toward it, never past it.
            </ToolNote>
          )}
        </div>
      </Panel>
      <ToolNote>Works for any currency. Brokerage, taxes and other charges are not included. Not investment advice.</ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

export function FireTool() {
  const [age, setAge] = useState(30);
  const [expenses, setExpenses] = useState(60000);
  const [corpus, setCorpus] = useState(1_500_000);
  const [monthly, setMonthly] = useState(50000);
  const [stepUp, setStepUp] = useState(8);
  const [rate, setRate] = useState(11);
  const [inflation, setInflation] = useState(6);
  const [swr, setSwr] = useState(4);

  const result = useMemo(
    () =>
      fireProjection({
        monthlyExpenses: expenses,
        currentCorpus: corpus,
        monthlyInvestment: monthly,
        annualStepUpPct: stepUp,
        annualReturnPct: rate,
        inflationPct: inflation,
        withdrawalRatePct: swr,
      }),
    [expenses, corpus, monthly, stepUp, rate, inflation, swr]
  );
  const chart = useMemo(
    () => result.chart.map((p) => ({ year: p.year, corpus: Math.round(p.corpus), target: Math.round(p.target) })),
    [result]
  );
  const years = result.yearsToFire;

  return (
    <ToolStack>
      <CalculatorSlider label="Current age" value={age} min={18} max={70} step={1} unit=" yrs" onChange={setAge} />
      <CalculatorSlider label="Monthly expenses today" value={expenses} min={5000} max={2_000_000} step={1000} prefix="₹" onChange={setExpenses} />
      <CalculatorSlider label="Current investments" value={corpus} min={0} max={500_000_000} step={50_000} prefix="₹" onChange={setCorpus} />
      <CalculatorSlider label="Monthly investment" value={monthly} min={0} max={2_000_000} step={1000} prefix="₹" onChange={setMonthly} />
      <CalculatorSlider label="Yearly increase in investment" value={stepUp} min={0} max={30} step={1} unit="%" onChange={setStepUp} />
      <CalculatorSlider label="Expected return (p.a.)" value={rate} min={1} max={20} step={0.5} unit="%" onChange={setRate} />
      <CalculatorSlider label="Inflation" value={inflation} min={0} max={12} step={0.5} unit="%" onChange={setInflation} />
      <CalculatorSlider label="Withdrawal rate in retirement" value={swr} min={2} max={6} step={0.25} unit="%" onChange={setSwr} />
      <KPIStrip
        items={[
          {
            label: "Years to FIRE",
            value: years === null ? "60+" : years.toFixed(1),
            hint: years === null ? "Not reached in 60 years" : `Around age ${Math.round(age + years)}`,
            highlight: true,
          },
          { label: "FIRE number today", value: formatCompactCurrency(result.fireNumberToday), hint: `${(100 / swr).toFixed(1)}× yearly expenses` },
          {
            label: "Corpus needed then",
            value: result.corpusAtFire === null ? "—" : formatCompactCurrency(result.corpusAtFire),
            hint: "inflation-adjusted",
          },
        ]}
      />
      <GrowthChart
        ariaLabel="Projected investment corpus against the inflation-adjusted FIRE target by year"
        data={chart}
        xKey="year"
        formatX={yearTick}
        formatValue={formatCurrency}
        formatAxis={formatCompactCurrency}
        series={[
          { key: "corpus", label: "Your corpus" },
          { key: "target", label: "FIRE target (rises with inflation)", tone: "muted" },
        ]}
      />
      <ToolNote>
        FIRE number = yearly expenses ÷ withdrawal rate. The withdrawal rate is a planning assumption, not a guarantee — lower
        rates are more conservative. Returns, inflation and taxes will differ from these inputs. Not financial advice.
      </ToolNote>
    </ToolStack>
  );
}

/* ------------------------------------------------------------------ */

export function HomeLoanEligibilityTool() {
  const [income, setIncome] = useState(150000);
  const [existing, setExisting] = useState(10000);
  const [share, setShare] = useState(50);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [down, setDown] = useState(20);

  const result = useMemo(
    () =>
      homeLoanEligibility({
        monthlyIncome: income,
        existingEmis: existing,
        emiShareOfIncomePct: share,
        annualRatePct: rate,
        tenureYears: tenure,
        downPaymentPct: down,
      }),
    [income, existing, share, rate, tenure, down]
  );

  return (
    <ToolStack>
      <CalculatorSlider label="Net monthly income" value={income} min={10_000} max={5_000_000} step={1000} prefix="₹" onChange={setIncome} />
      <CalculatorSlider label="Existing EMIs per month" value={existing} min={0} max={2_000_000} step={500} prefix="₹" onChange={setExisting} />
      <CalculatorSlider label="Share of income allowed for all EMIs" value={share} min={30} max={65} step={1} unit="%" onChange={setShare} />
      <CalculatorSlider label="Interest rate (p.a.)" value={rate} min={5} max={16} step={0.05} unit="%" onChange={setRate} />
      <CalculatorSlider label="Loan tenure" value={tenure} min={1} max={30} step={1} unit=" yrs" onChange={setTenure} />
      <CalculatorSlider label="Down payment" value={down} min={0} max={80} step={1} unit="%" onChange={setDown} />
      <KPIStrip
        items={[
          { label: "Loan you may qualify for", value: formatCompactCurrency(result.loanAmount), highlight: true },
          { label: "Affordable EMI", value: formatCurrency(Math.floor(result.maxEmi)) },
          { label: "Property budget", value: formatCompactCurrency(result.propertyBudget), hint: `with ${down}% down payment` },
          { label: "Interest over tenure", value: formatCompactCurrency(result.totalInterest) },
        ]}
      />
      {result.maxEmi === 0 && (
        <p className="rounded-xl border border-theme-subtle bg-theme-surface p-4 text-sm text-theme-muted">
          Existing EMIs already use the full share of income set above, so there is no room for a new EMI at these inputs.
        </p>
      )}
      <ToolNote>
        Lenders decide eligibility with their own rules — credit score, age, employer, property and policy limits all matter. Use
        this as a starting estimate before you speak to a bank. Not a loan offer.
      </ToolNote>
    </ToolStack>
  );
}
