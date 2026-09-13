/** Month-by-month home-loan vs mutual-fund SIP comparison. */

export type HousingOccupancy = "rent_out" | "self_occupy";

export interface HomeLoanVsSipInput {
  propertyPrice: number;
  downPaymentPercent: number;
  loanRate: number;
  tenureYears: number;
  horizonYears: number;
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
  occupancy: HousingOccupancy;
  vacancyPercent: number;
  stampDutyPercent: number;
  otherClosingPercent: number;
  propertyTaxAnnual: number;
  homeInsuranceMonthly: number;
  rentalIncomeTaxPercent: number;
  sellingCostPercent: number;
  assumeSellAtEnd: boolean;
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
  closingCosts: number;
  upfrontCash: number;
  emi: number;
  months: number;
  tenureMonths: number;
  firstMonthNetOutflow: number;
  firstMonthMatchedSip: number;
  firstMonthRent: number;
  firstMonthExpenses: number;
  firstMonthComparableRent: number;
  totalEmiPaid: number;
  totalRentReceived: number;
  totalExpenses: number;
  totalInterest: number;
  totalSipInvested: number;
  endingPropertyValue: number;
  endingLoanOutstanding: number;
  surplusCorpus: number;
  housingNetWorthKeep: number;
  housingNetWorthIfSold: number;
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

function yearIndex(monthZeroBased: number): number {
  return Math.floor(monthZeroBased / 12);
}

export function simulateHomeLoanVsSip(input: HomeLoanVsSipInput): HomeLoanVsSipResult {
  const tenureMonths = Math.max(1, Math.round(input.tenureYears * 12));
  const months = Math.max(1, Math.round(input.horizonYears * 12));
  const downPayment = (input.propertyPrice * input.downPaymentPercent) / 100;
  const closingCosts =
    (input.propertyPrice * (Math.max(0, input.stampDutyPercent) + Math.max(0, input.otherClosingPercent))) / 100;
  const upfrontCash = downPayment + closingCosts;
  const loanAmount = Math.max(0, input.propertyPrice - downPayment);
  const emi = monthlyEmi(loanAmount, input.loanRate, tenureMonths);
  const loanRateM = input.loanRate / 12 / 100;
  const mfRateM = input.mfReturnRate / 12 / 100;
  const appRateM = Math.pow(1 + input.appreciationRate / 100, 1 / 12) - 1;
  const vacancyFactor = 1 - Math.min(100, Math.max(0, input.vacancyPercent)) / 100;
  const rentTaxFactor = 1 - Math.min(100, Math.max(0, input.rentalIncomeTaxPercent)) / 100;
  const sellFactor = 1 - Math.min(100, Math.max(0, input.sellingCostPercent)) / 100;

  let remaining = loanAmount;
  let propertyValue = input.propertyPrice;
  let sipCorpus = input.investDownPaymentInSip ? upfrontCash : 0;
  let surplusCorpus = 0;
  let totalSipInvested = input.investDownPaymentInSip ? upfrontCash : 0;
  let totalEmiPaid = 0;
  let totalRentReceived = 0;
  let totalExpenses = 0;
  let totalInterest = 0;

  let firstMonthNetOutflow = 0;
  let firstMonthMatchedSip = 0;
  let firstMonthRent = 0;
  let firstMonthExpenses = 0;
  let firstMonthComparableRent = 0;

  const yearly: HomeLoanVsSipYearRow[] = [];
  let yEmi = 0;
  let yRent = 0;
  let yExp = 0;
  let yNet = 0;
  let ySip = 0;

  const housingNet = (sold: boolean) =>
    (sold ? propertyValue * sellFactor : propertyValue) - remaining + surplusCorpus;

  for (let m = 0; m < months; m++) {
    const yi = yearIndex(m);
    const scheduledRent = input.monthlyRent * Math.pow(1 + input.rentIncrementPercent / 100, yi);
    const maint = input.monthlyMaintenance * Math.pow(1 + input.expenseIncrementPercent / 100, yi);
    const util = input.monthlyUtility * Math.pow(1 + input.expenseIncrementPercent / 100, yi);
    const tax = (input.propertyTaxAnnual / 12) * Math.pow(1 + input.expenseIncrementPercent / 100, yi);
    const insur = input.homeInsuranceMonthly * Math.pow(1 + input.expenseIncrementPercent / 100, yi);
    const expenses = maint + util + tax + insur;

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

    const cashRent =
      input.occupancy === "rent_out" ? scheduledRent * vacancyFactor * rentTaxFactor : 0;
    const comparableRent = scheduledRent;
    const housingCashOut = payment + expenses;
    const netOutflow = housingCashOut - cashRent;

    const renterOutflow = input.occupancy === "self_occupy" ? comparableRent : cashRent;
    const matchedSip = Math.max(0, housingCashOut - renterOutflow);
    const surplus = Math.max(0, renterOutflow - housingCashOut);
    const sipThisMonth = input.matchSipToNetOutflow ? matchedSip : Math.max(0, input.customMonthlySip);

    if (m === 0) {
      firstMonthNetOutflow = netOutflow;
      firstMonthMatchedSip = matchedSip;
      firstMonthRent = cashRent;
      firstMonthExpenses = expenses;
      firstMonthComparableRent = comparableRent;
    }

    sipCorpus = sipCorpus * (1 + mfRateM) + sipThisMonth;
    totalSipInvested += sipThisMonth;

    if (input.investPropertySurplus) {
      surplusCorpus = surplusCorpus * (1 + mfRateM) + surplus;
    }

    yEmi += payment;
    yRent += cashRent;
    yExp += expenses;
    yNet += netOutflow;
    ySip += sipThisMonth;
    totalRentReceived += cashRent;
    totalExpenses += expenses;

    const isYearEnd = (m + 1) % 12 === 0 || m === months - 1;
    if (isYearEnd) {
      yearly.push({
        year: yearly.length + 1,
        emiPaid: yEmi,
        rentReceived: yRent,
        expensesPaid: yExp,
        netHousingOutflow: yNet,
        sipContribution: ySip,
        propertyValue,
        loanOutstanding: remaining,
        housingNetWorth: housingNet(input.assumeSellAtEnd),
        sipCorpus,
      });
      yEmi = 0;
      yRent = 0;
      yExp = 0;
      yNet = 0;
      ySip = 0;
    }
  }

  const housingNetWorthKeep = housingNet(false);
  const housingNetWorthIfSold = housingNet(true);
  const housingNetWorth = input.assumeSellAtEnd ? housingNetWorthIfSold : housingNetWorthKeep;
  const advantage = housingNetWorth - sipCorpus;
  const winner: HomeLoanVsSipResult["winner"] =
    Math.abs(advantage) < 1 ? "tie" : advantage > 0 ? "housing" : "sip";

  return {
    loanAmount,
    downPayment,
    closingCosts,
    upfrontCash,
    emi,
    months,
    tenureMonths,
    firstMonthNetOutflow,
    firstMonthMatchedSip,
    firstMonthRent,
    firstMonthExpenses,
    firstMonthComparableRent,
    totalEmiPaid,
    totalRentReceived,
    totalExpenses,
    totalInterest,
    totalSipInvested,
    endingPropertyValue: propertyValue,
    endingLoanOutstanding: remaining,
    surplusCorpus,
    housingNetWorthKeep,
    housingNetWorthIfSold,
    housingNetWorth,
    sipCorpus,
    winner,
    advantage,
    yearly,
  };
}
