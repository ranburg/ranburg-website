/** Month-by-month home-loan (rent-out) vs mutual-fund SIP comparison. */

export interface HomeLoanVsSipInput {
  propertyPrice: number;
  downPaymentPercent: number;
  loanRate: number;
  tenureYears: number;
  appreciationRate: number;
  monthlyRent: number;
  rentIncrementPercent: number;
  monthlyMaintenance: number;
  monthlyUtility: number;
  expenseIncrementPercent: number;
  mfReturnRate: number;
  matchSipToNetOutflow: boolean;
  customMonthlySip: number;
  investDownPaymentInSip: boolean;
  investPropertySurplus: boolean;
}

export interface HomeLoanVsSipYearRow {
  year: number;
  emiPaid: number;
  rentReceived: number;
  expensesPaid: number;
  netHousingOutflow: number;
  sipContribution: number;
  propertyValue: number;
  loanOutstanding: number;
  housingNetWorth: number;
  sipCorpus: number;
}

export interface HomeLoanVsSipResult {
  loanAmount: number;
  downPayment: number;
  emi: number;
  months: number;
  firstMonthNetOutflow: number;
  firstMonthMatchedSip: number;
  firstMonthRent: number;
  firstMonthExpenses: number;
  totalEmiPaid: number;
  totalRentReceived: number;
  totalExpenses: number;
  totalInterest: number;
  totalSipInvested: number;
  endingPropertyValue: number;
  endingLoanOutstanding: number;
  surplusCorpus: number;
  housingNetWorth: number;
  sipCorpus: number;
  winner: "housing" | "sip" | "tie";
  advantage: number;
  yearly: HomeLoanVsSipYearRow[];
}

export function monthlyEmi(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
}

export function simulateHomeLoanVsSip(input: HomeLoanVsSipInput): HomeLoanVsSipResult {
  const months = Math.max(1, Math.round(input.tenureYears * 12));
  const downPayment = (input.propertyPrice * input.downPaymentPercent) / 100;
  const loanAmount = Math.max(0, input.propertyPrice - downPayment);
  const emi = monthlyEmi(loanAmount, input.loanRate, months);
  const loanRateM = input.loanRate / 12 / 100;
  const mfRateM = input.mfReturnRate / 12 / 100;
  const appRateM = Math.pow(1 + input.appreciationRate / 100, 1 / 12) - 1;

  let remaining = loanAmount;
  let propertyValue = input.propertyPrice;
  let sipCorpus = input.investDownPaymentInSip ? downPayment : 0;
  let surplusCorpus = 0;
  let totalSipInvested = input.investDownPaymentInSip ? downPayment : 0;
  let totalEmiPaid = 0;
  let totalRentReceived = 0;
  let totalExpenses = 0;
  let totalInterest = 0;

  let firstMonthNetOutflow = 0;
  let firstMonthMatchedSip = 0;
  let firstMonthRent = 0;
  let firstMonthExpenses = 0;

  const yearly: HomeLoanVsSipYearRow[] = [];
  let yEmi = 0;
  let yRent = 0;
  let yExp = 0;
  let yNet = 0;
  let ySip = 0;

  for (let m = 0; m < months; m++) {
    const yearIndex = Math.floor(m / 12);
    const rent = input.monthlyRent * Math.pow(1 + input.rentIncrementPercent / 100, yearIndex);
    const maint = input.monthlyMaintenance * Math.pow(1 + input.expenseIncrementPercent / 100, yearIndex);
    const util = input.monthlyUtility * Math.pow(1 + input.expenseIncrementPercent / 100, yearIndex);
    const expenses = maint + util;

    const interest = remaining * loanRateM;
    let payment = remaining <= 0 ? 0 : emi;
    if (remaining > 0 && remaining + interest < payment) {
      payment = remaining + interest;
    }
    const principalPaid = Math.max(0, payment - interest);
    remaining = Math.max(0, remaining - principalPaid);
    totalInterest += interest;
    totalEmiPaid += payment;

    propertyValue *= 1 + appRateM;

    const netOutflow = payment + expenses - rent;
    const matchedSip = Math.max(0, netOutflow);
    const sipThisMonth = input.matchSipToNetOutflow ? matchedSip : Math.max(0, input.customMonthlySip);
    const surplus = netOutflow < 0 ? -netOutflow : 0;

    if (m === 0) {
      firstMonthNetOutflow = netOutflow;
      firstMonthMatchedSip = matchedSip;
      firstMonthRent = rent;
      firstMonthExpenses = expenses;
    }

    sipCorpus = sipCorpus * (1 + mfRateM) + sipThisMonth;
    totalSipInvested += sipThisMonth;

    if (input.investPropertySurplus) {
      surplusCorpus = surplusCorpus * (1 + mfRateM) + surplus;
    }

    yEmi += payment;
    yRent += rent;
    yExp += expenses;
    yNet += netOutflow;
    ySip += sipThisMonth;
    totalRentReceived += rent;
    totalExpenses += expenses;

    const isYearEnd = (m + 1) % 12 === 0 || m === months - 1;
    if (isYearEnd) {
      const housingNetWorth = propertyValue - remaining + surplusCorpus;
      yearly.push({
        year: yearly.length + 1,
        emiPaid: yEmi,
        rentReceived: yRent,
        expensesPaid: yExp,
        netHousingOutflow: yNet,
        sipContribution: ySip,
        propertyValue,
        loanOutstanding: remaining,
        housingNetWorth,
        sipCorpus,
      });
      yEmi = 0;
      yRent = 0;
      yExp = 0;
      yNet = 0;
      ySip = 0;
    }
  }

  const housingNetWorth = propertyValue - remaining + surplusCorpus;
  const advantage = housingNetWorth - sipCorpus;
  const winner: HomeLoanVsSipResult["winner"] =
    Math.abs(advantage) < 1 ? "tie" : advantage > 0 ? "housing" : "sip";

  return {
    loanAmount,
    downPayment,
    emi,
    months,
    firstMonthNetOutflow,
    firstMonthMatchedSip,
    firstMonthRent,
    firstMonthExpenses,
    totalEmiPaid,
    totalRentReceived,
    totalExpenses,
    totalInterest,
    totalSipInvested,
    endingPropertyValue: propertyValue,
    endingLoanOutstanding: remaining,
    surplusCorpus,
    housingNetWorth,
    sipCorpus,
    winner,
    advantage,
    yearly,
  };
}
