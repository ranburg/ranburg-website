/**
 * Runnable checks for finance helpers (no test runner required).
 * npm run test:finance
 */

import assert from "node:assert/strict";
import { cagr } from "../demandMath";
import {
  CITY_HOUSING_CAGR,
  citiesByCountry,
  suggestedMonthlyRent,
} from "./cityHousingCagr";
import { monthlyEmi, simulateHomeLoanVsSip, type HomeLoanVsSipInput } from "./homeLoanVsSip";
import { sipFutureValue } from "./sipProjection";

function base(over: Partial<HomeLoanVsSipInput> = {}): HomeLoanVsSipInput {
  return {
    propertyPrice: 75_00_000,
    downPaymentPercent: 20,
    loanRate: 8.5,
    tenureYears: 20,
    horizonYears: 20,
    appreciationRate: 5,
    monthlyRent: 25_000,
    rentIncrementPercent: 5,
    monthlyMaintenance: 4_000,
    monthlyUtility: 3_000,
    expenseIncrementPercent: 5,
    mfReturnRate: 12,
    matchSipToNetOutflow: true,
    customMonthlySip: 35_000,
    investDownPaymentInSip: true,
    investPropertySurplus: true,
    occupancy: "rent_out",
    vacancyPercent: 0,
    stampDutyPercent: 0,
    otherClosingPercent: 0,
    propertyTaxAnnual: 0,
    homeInsuranceMonthly: 0,
    rentalIncomeTaxPercent: 0,
    sellingCostPercent: 2,
    assumeSellAtEnd: false,
    ...over,
  };
}

function near(actual: number, expected: number, tol = 2): void {
  assert.ok(Math.abs(actual - expected) <= tol, `expected ${expected} ±${tol}, got ${actual}`);
}

const loan = 60_00_000;
const emi = monthlyEmi(loan, 8.5, 240);
near(emi, 52069, 2);

const sipClosed = sipFutureValue({ monthlyInvestment: 10_000, annualReturnPct: 12, years: 10 });
const r = 0.12 / 12;
const n = 120;
const closedForm = 10_000 * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
near(sipClosed.futureValue, closedForm, 1);
assert.equal(sipClosed.totalInvested, 12_00_000);

const stepped = sipFutureValue({
  monthlyInvestment: 10_000,
  annualReturnPct: 12,
  years: 10,
  stepUpPercent: 10,
});
assert.ok(stepped.totalInvested > sipClosed.totalInvested);
assert.ok(stepped.futureValue > sipClosed.futureValue);

const rate10 = cagr(100, 200, 10);
assert.ok(rate10 !== null);
near(rate10 * 100, 7.177, 0.01);

assert.equal(citiesByCountry("India").length, 20);
assert.equal(citiesByCountry("United States").length, 20);
assert.ok(citiesByCountry("Singapore").length >= 2);
assert.equal(new Set(CITY_HOUSING_CAGR.map((c) => c.id)).size, CITY_HOUSING_CAGR.length);
assert.ok(CITY_HOUSING_CAGR.some((c) => c.cagr10y >= 11));
assert.ok(CITY_HOUSING_CAGR.some((c) => c.cagr10y < 0));
assert.equal(suggestedMonthlyRent(75_00_000, 2.8), 18_000);

const rentOut = simulateHomeLoanVsSip(base());
assert.equal(rentOut.loanAmount, 60_00_000);
near(rentOut.emi, emi, 1);
assert.equal(rentOut.yearly.length, 20);
assert.equal(rentOut.upfrontCash, 15_00_000);
assert.ok(rentOut.sipCorpus > 0);
assert.ok(rentOut.housingNetWorthKeep > rentOut.housingNetWorthIfSold);

const vacant = simulateHomeLoanVsSip(base({ vacancyPercent: 100 }));
assert.equal(vacant.totalRentReceived, 0);
assert.ok(vacant.sipCorpus > rentOut.sipCorpus);

const stamped = simulateHomeLoanVsSip(base({ stampDutyPercent: 5 }));
assert.equal(stamped.closingCosts, 3_75_000);
assert.ok(stamped.totalSipInvested > rentOut.totalSipInvested);

const liveIn = simulateHomeLoanVsSip(base({ occupancy: "self_occupy" }));
assert.equal(liveIn.totalRentReceived, 0);
assert.ok(liveIn.firstMonthNetOutflow > rentOut.firstMonthNetOutflow);
near(liveIn.firstMonthMatchedSip, rentOut.firstMonthMatchedSip, 1);

const vacantVsLive = simulateHomeLoanVsSip(base({ occupancy: "rent_out", vacancyPercent: 20 }));
assert.ok(vacantVsLive.firstMonthMatchedSip > liveIn.firstMonthMatchedSip);

const short = simulateHomeLoanVsSip(base({ horizonYears: 10 }));
assert.ok(short.endingLoanOutstanding > 1);
assert.equal(short.yearly.length, 10);
assert.ok(short.months < rentOut.months);

const highCagr = simulateHomeLoanVsSip(base({ appreciationRate: 18 }));
assert.ok(highCagr.endingPropertyValue > rentOut.endingPropertyValue);

const sold = simulateHomeLoanVsSip(base({ assumeSellAtEnd: true, sellingCostPercent: 2 }));
near(sold.housingNetWorth, sold.housingNetWorthIfSold, 1);

const cash = simulateHomeLoanVsSip(base({ downPaymentPercent: 100 }));
assert.equal(cash.loanAmount, 0);
assert.equal(cash.emi, 0);

const neg = simulateHomeLoanVsSip(base({ appreciationRate: -5 }));
assert.ok(neg.endingPropertyValue < 75_00_000);

console.log("finance checks passed");
