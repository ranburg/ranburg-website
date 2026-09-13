"use client";

import { CITY_HOUSING_CAGR, CITY_HOUSING_COUNTRY_ORDER, type CityHousingCagr } from "@/lib/finance/cityHousingCagr";
import { cn } from "@/lib/utils";

export function CityHousingSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (city: CityHousingCagr | null) => void;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-theme-body">City 10-year price CAGR</span>
      <select
        className="input-field mt-1.5"
        value={value}
        onChange={(e) => {
          const id = e.target.value;
          const city = CITY_HOUSING_CAGR.find((c) => c.id === id) ?? null;
          onChange(city);
        }}
      >
        <option value="">Custom (set CAGR yourself)</option>
        {CITY_HOUSING_COUNTRY_ORDER.map((country) => (
          <optgroup key={country} label={country}>
            {CITY_HOUSING_CAGR.filter((c) => c.country === country).map((c) => (
              <option key={c.id} value={c.id}>
                {c.city} — {c.cagr10y.toFixed(1)}%
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="mt-1.5 text-xs leading-relaxed text-theme-muted">
        Applies an indicative 10-year nominal housing CAGR (~2015–2025). Past prices are not a forecast. Amounts stay in ₹ —
        change price and rent to your market.
      </p>
    </label>
  );
}

export function CityHousingCagrTable({
  onPick,
  selectedId,
}: {
  onPick?: (city: CityHousingCagr) => void;
  selectedId?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-theme-subtle">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-theme-surface text-[11px] uppercase tracking-wider text-theme-subtle">
          <tr>
            <th className="px-3 py-2 font-semibold">City</th>
            <th className="px-3 py-2 font-semibold">Country</th>
            <th className="px-3 py-2 font-semibold tabular-nums">10y CAGR</th>
            <th className="px-3 py-2 font-semibold tabular-nums">Rent yield</th>
          </tr>
        </thead>
        <tbody>
          {CITY_HOUSING_COUNTRY_ORDER.flatMap((country) =>
            CITY_HOUSING_CAGR.filter((c) => c.country === country).map((c) => (
              <tr
                key={c.id}
                className={cn(
                  "border-t border-theme-subtle",
                  onPick && "cursor-pointer hover:bg-accent/5",
                  selectedId === c.id && "bg-accent/10"
                )}
                onClick={onPick ? () => onPick(c) : undefined}
              >
                <td className="px-3 py-1.5 font-medium text-theme-heading">{c.city}</td>
                <td className="px-3 py-1.5 text-theme-muted">{c.country}</td>
                <td className="px-3 py-1.5 tabular-nums text-theme-heading">{c.cagr10y.toFixed(1)}%</td>
                <td className="px-3 py-1.5 tabular-nums text-theme-muted">{c.rentYieldPct.toFixed(1)}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
