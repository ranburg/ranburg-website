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

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
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
