"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  "USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD",
  "HKD", "NZD", "SEK", "NOK", "DKK", "ZAR", "BRL", "MXN", "KRW", "PLN",
];

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [base, setBase] = useState("USD");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchRates = useCallback(async (currency: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${currency}`);
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();
      setRates({ [currency]: 1, ...data.rates });
      setBase(currency);
      setLastUpdated(data.date);
    } catch {
      setError("Unable to load exchange rates. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(base);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const convert = (): string => {
    const num = parseFloat(amount);
    if (isNaN(num) || !rates[from] || !rates[to]) return "—";
    const inBase = from === base ? num : num / rates[from];
    const result = to === base ? inBase : inBase * rates[to];
    return result.toFixed(2);
  };

  const rate = (): string => {
    if (!rates[from] || !rates[to]) return "—";
    const oneUnit = from === base ? 1 : 1 / rates[from];
    const converted = to === base ? oneUnit : oneUnit * rates[to];
    return converted.toFixed(4);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-theme-muted">
            {lastUpdated ? `Rates as of ${lastUpdated} (ECB via Frankfurter)` : "Loading rates…"}
          </p>
          <button type="button" onClick={() => fetchRates(base)} disabled={loading} className="flex items-center gap-1 text-sm text-accent hover:underline disabled:opacity-50">
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Amount</label>
            <div className="flex gap-2">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field flex-1 text-lg font-semibold" />
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-field w-24">
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" onClick={swap} className="mb-2 rounded-xl border border-theme-subtle p-3 text-theme-muted hover:border-accent/40 hover:text-accent" aria-label="Swap currencies">
            <ArrowLeftRight className="h-5 w-5" />
          </button>
          <div>
            <label className="mb-2 block text-sm text-theme-muted">Converted</label>
            <div className="flex gap-2">
              <div className="input-field flex-1 text-lg font-semibold text-accent">{convert()}</div>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="input-field w-24">
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-theme-muted">
          1 {from} = {rate()} {to}
        </p>
      </div>
    </div>
  );
}
