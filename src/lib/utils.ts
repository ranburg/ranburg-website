import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact INR for tight ResultCard grids (e.g. ₹1.23 Cr, ₹12.5 L). */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) {
    const cr = abs / 1_00_00_000;
    return `${sign}₹${cr.toFixed(cr >= 10 ? 2 : 2).replace(/\.?0+$/, "")} Cr`;
  }
  if (abs >= 1_00_000) {
    const lakh = abs / 1_00_000;
    return `${sign}₹${lakh.toFixed(lakh >= 10 ? 1 : 2).replace(/\.?0+$/, "")} L`;
  }
  if (abs >= 1_000) {
    return formatCurrency(value);
  }
  return formatCurrency(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact number for slider chips when values get large. */
export function formatCompactNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) {
    const cr = abs / 1_00_00_000;
    return `${sign}${cr.toFixed(cr >= 10 ? 1 : 2).replace(/\.?0+$/, "")} Cr`;
  }
  if (abs >= 1_00_000) {
    const lakh = abs / 1_00_000;
    return `${sign}${lakh.toFixed(lakh >= 10 ? 1 : 2).replace(/\.?0+$/, "")} L`;
  }
  return formatNumber(value);
}

/** Present value: PV = FV / (1 + r)^n */
export function presentValue(
  futureValue: number,
  inflationRatePercent: number,
  years: number
): number {
  if (years <= 0) return futureValue;
  const r = inflationRatePercent / 100;
  if (r === 0) return futureValue;
  return futureValue / Math.pow(1 + r, years);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
