/** Month-by-month SIP future value with optional annual step-up. */

export function sipFutureValue(params: {
  monthlyInvestment: number;
  annualReturnPct: number;
  years: number;
  stepUpPercent?: number;
}): { futureValue: number; totalInvested: number; chart: { year: number; invested: number; value: number }[] } {
  const years = Math.max(0, Math.round(params.years));
  const monthlyRate = params.annualReturnPct / 12 / 100;
  const step = (params.stepUpPercent ?? 0) / 100;
  let monthly = Math.max(0, params.monthlyInvestment);
  let value = 0;
  let invested = 0;
  const chart: { year: number; invested: number; value: number }[] = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = (value + monthly) * (1 + monthlyRate);
      invested += monthly;
    }
    chart.push({ year: y, invested, value });
    monthly *= 1 + step;
  }

  return { futureValue: value, totalInvested: invested, chart };
}
