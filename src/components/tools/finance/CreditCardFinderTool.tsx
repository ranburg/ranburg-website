"use client";

import { useMemo, useState } from "react";
import {
  COUNTRY_OPTIONS,
  SPEND_CATEGORIES,
  rankCreditCards,
  formatMoney,
  type CardCountry,
  type CreditScoreBand,
  type SpendCategory,
} from "@/lib/creditCardRecommender";
import { CreditCard, ChevronRight, ChevronLeft, Sparkles, AlertTriangle } from "lucide-react";

const STEPS = ["Country", "Income & score", "Spending", "Preferences", "Results"] as const;

export default function CreditCardFinderTool() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<CardCountry>("IN");
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [score, setScore] = useState<CreditScoreBand>("good");
  const [spend, setSpend] = useState<Partial<Record<SpendCategory, number>>>({
    groceries: 8000,
    fuel: 4000,
    dining: 3000,
    online: 5000,
    travel: 2000,
    utilities: 2500,
    entertainment: 1000,
    general: 3000,
  });
  const [preferNoFee, setPreferNoFee] = useState(true);
  const [caresAboutTravel, setCaresAboutTravel] = useState(false);

  const currency = COUNTRY_OPTIONS.find((c) => c.code === country)?.currency ?? "USD";

  const ranked = useMemo(
    () =>
      rankCreditCards({
        country,
        monthlyIncome,
        score,
        spendByCategory: spend,
        preferNoFee,
        caresAboutTravel,
      }),
    [country, monthlyIncome, score, spend, preferNoFee, caresAboutTravel]
  );

  const defaultsForCountry = (code: CardCountry) => {
    const map: Record<CardCountry, number> = {
      IN: 80000,
      US: 5000,
      UK: 3000,
      CA: 4500,
      AU: 5500,
      SG: 4500,
      AE: 12000,
    };
    setMonthlyIncome(map[code]);
    const spendMap: Record<CardCountry, Partial<Record<SpendCategory, number>>> = {
      IN: { groceries: 8000, fuel: 4000, dining: 3000, online: 5000, travel: 2000, utilities: 2500, entertainment: 1000, general: 3000 },
      US: { groceries: 500, fuel: 200, dining: 350, online: 250, travel: 150, utilities: 200, entertainment: 80, general: 300 },
      UK: { groceries: 350, fuel: 120, dining: 200, online: 150, travel: 100, utilities: 180, entertainment: 50, general: 200 },
      CA: { groceries: 450, fuel: 180, dining: 250, online: 180, travel: 120, utilities: 160, entertainment: 60, general: 220 },
      AU: { groceries: 500, fuel: 200, dining: 280, online: 200, travel: 150, utilities: 180, entertainment: 70, general: 250 },
      SG: { groceries: 400, fuel: 150, dining: 350, online: 220, travel: 180, utilities: 140, entertainment: 60, general: 200 },
      AE: { groceries: 1200, fuel: 500, dining: 800, online: 600, travel: 700, utilities: 500, entertainment: 200, general: 800 },
    };
    setSpend(spendMap[code]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              i === step
                ? "bg-accent text-white shadow-glow"
                : i < step
                  ? "bg-accent/15 text-accent"
                  : "bg-theme-surface text-theme-subtle"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <Panel title="Where do you live?" subtitle="We'll only recommend cards typically available in your country.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRY_OPTIONS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCountry(c.code);
                  defaultsForCountry(c.code);
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  country === c.code
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-theme bg-theme-surface hover:border-accent/40"
                }`}
              >
                <p className="font-bold text-theme-heading">{c.label}</p>
                <p className="mt-1 text-xs text-theme-muted">{c.currency}</p>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 1 && (
        <Panel title="Eligibility basics" subtitle="Rough filters — banks still run their own checks.">
          <label className="block text-sm font-medium text-theme-body">
            Monthly take-home income ({currency})
            <input
              type="number"
              className="input-field mt-2"
              value={monthlyIncome}
              min={0}
              onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
            />
          </label>
          <p className="mt-4 text-sm font-medium text-theme-body">Credit score band</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["excellent", "Excellent (750+)"],
                ["good", "Good (700–749)"],
                ["fair", "Fair (650–699)"],
                ["building", "Building / thin file"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setScore(id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  score === id ? "border-accent bg-accent/10 text-accent" : "border-theme text-theme-body"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 2 && (
        <Panel title="Where does your money go?" subtitle="Monthly spend by category — used to estimate reward fit.">
          <div className="grid gap-4 sm:grid-cols-2">
            {SPEND_CATEGORIES.map((cat) => (
              <label key={cat.id} className="block text-sm font-medium text-theme-body">
                {cat.label}
                <input
                  type="number"
                  className="input-field mt-1.5"
                  value={spend[cat.id] ?? 0}
                  min={0}
                  onChange={(e) =>
                    setSpend((prev) => ({ ...prev, [cat.id]: Number(e.target.value) || 0 }))
                  }
                />
              </label>
            ))}
          </div>
        </Panel>
      )}

      {step === 3 && (
        <Panel title="What matters most?" subtitle="Optional preferences that re-rank the shortlist.">
          <Toggle
            checked={preferNoFee}
            onChange={setPreferNoFee}
            label="Prefer low / no annual fee"
            hint="Boosts zero-fee cards when rewards are close"
          />
          <Toggle
            checked={caresAboutTravel}
            onChange={setCaresAboutTravel}
            label="I care about travel rewards"
            hint="Prioritizes miles / lounge-style cards"
          />
        </Panel>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-theme-body">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p>
              Educational estimates only — not financial advice. Card availability, fees, and approval depend on the
              issuer. Always confirm on the bank&apos;s official site before applying.
            </p>
          </div>

          {ranked.length === 0 ? (
            <p className="text-theme-muted">No cards in catalog for this country yet.</p>
          ) : (
            ranked.slice(0, 5).map((row, idx) => (
              <article
                key={row.card.id}
                className="glass-card relative overflow-hidden p-5 sm:p-6"
              >
                {idx === 0 && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
                    <Sparkles className="h-3.5 w-3.5" /> Best match
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-theme-heading">{row.card.name}</h3>
                    <p className="text-sm text-theme-muted">
                      {row.card.issuer} · {row.card.network}
                      {!row.eligible && (
                        <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                          Stretch eligibility
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-sm text-theme-body">{row.card.highlight}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {row.card.perks.map((p) => (
                        <span key={p} className="rounded-full bg-theme-surface px-2.5 py-1 text-xs text-theme-muted">
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <Stat label="Est. annual rewards value" value={formatMoney(row.estimatedAnnualRewards, currency)} />
                      <Stat label="Annual fee" value={formatMoney(row.card.annualFee, currency)} />
                      <Stat label="Typical min income / mo" value={formatMoney(row.card.minIncomeMonthly, currency)} />
                    </div>
                    {row.reasons.length > 0 && (
                      <ul className="mt-3 list-inside list-disc text-sm text-theme-muted">
                        {row.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="inline-flex items-center gap-1.5 rounded-xl border border-theme px-4 py-2.5 text-sm font-semibold text-theme-body disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent"
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card space-y-4 p-5 sm:p-6">
      <div>
        <h3 className="text-xl font-bold text-theme-heading">{title}</h3>
        <p className="mt-1 text-sm text-theme-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-theme-surface px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-theme-subtle">{label}</p>
      <p className="mt-0.5 font-bold text-theme-heading">{value}</p>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition ${
        checked ? "border-accent bg-accent/10" : "border-theme bg-theme-surface"
      }`}
    >
      <div>
        <p className="font-semibold text-theme-heading">{label}</p>
        <p className="mt-1 text-sm text-theme-muted">{hint}</p>
      </div>
      <span
        className={`mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 transition ${checked ? "bg-accent" : "bg-slate-300 dark:bg-teal-900"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`}
        />
      </span>
    </button>
  );
}
