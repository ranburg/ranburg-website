/**
 * Indicative 10-year nominal residential price CAGRs (~2015–2025).
 * City averages from public indices and market reports (NHB RESIDEX / brokerage
 * city studies, Case-Shiller / NAR / Zillow metro medians, URA / HDB, national
 * HPIs). Micro-markets differ. Not a forecast and not total property return
 * (excludes rent, tax, leverage, and costs).
 */

export type CityHousingCountry =
  | "India"
  | "United States"
  | "Singapore"
  | "United Kingdom"
  | "Canada"
  | "Australia"
  | "UAE"
  | "Japan"
  | "Hong Kong"
  | "New Zealand"
  | "Germany"
  | "Netherlands"
  | "Ireland";

export interface CityHousingCagr {
  id: string;
  city: string;
  country: CityHousingCountry;
  /** Approximate 10-year nominal price CAGR (%). */
  cagr10y: number;
  /** Typical gross rental yield (% of price / year). */
  rentYieldPct: number;
  note?: string;
}

export const CITY_HOUSING_CAGR: CityHousingCagr[] = [
  // India — 20 cities
  { id: "in-hyderabad", city: "Hyderabad", country: "India", cagr10y: 8.2, rentYieldPct: 3.2 },
  { id: "in-pune", city: "Pune", country: "India", cagr10y: 7.6, rentYieldPct: 3.0 },
  { id: "in-bengaluru", city: "Bengaluru", country: "India", cagr10y: 7.4, rentYieldPct: 2.8 },
  { id: "in-ahmedabad", city: "Ahmedabad", country: "India", cagr10y: 7.1, rentYieldPct: 3.1 },
  { id: "in-surat", city: "Surat", country: "India", cagr10y: 6.8, rentYieldPct: 3.4 },
  { id: "in-noida", city: "Noida", country: "India", cagr10y: 6.2, rentYieldPct: 3.0 },
  { id: "in-gurugram", city: "Gurugram", country: "India", cagr10y: 6.0, rentYieldPct: 2.7 },
  { id: "in-chennai", city: "Chennai", country: "India", cagr10y: 5.8, rentYieldPct: 2.9 },
  { id: "in-lucknow", city: "Lucknow", country: "India", cagr10y: 5.7, rentYieldPct: 3.3 },
  { id: "in-indore", city: "Indore", country: "India", cagr10y: 5.6, rentYieldPct: 3.4 },
  { id: "in-kochi", city: "Kochi", country: "India", cagr10y: 5.4, rentYieldPct: 3.2 },
  { id: "in-jaipur", city: "Jaipur", country: "India", cagr10y: 5.3, rentYieldPct: 3.3 },
  { id: "in-coimbatore", city: "Coimbatore", country: "India", cagr10y: 5.2, rentYieldPct: 3.4 },
  { id: "in-vizag", city: "Visakhapatnam", country: "India", cagr10y: 5.1, rentYieldPct: 3.3 },
  { id: "in-tvm", city: "Thiruvananthapuram", country: "India", cagr10y: 5.0, rentYieldPct: 3.2 },
  { id: "in-chandigarh", city: "Chandigarh", country: "India", cagr10y: 4.8, rentYieldPct: 2.9 },
  { id: "in-mumbai", city: "Mumbai", country: "India", cagr10y: 4.5, rentYieldPct: 2.4 },
  { id: "in-nagpur", city: "Nagpur", country: "India", cagr10y: 4.5, rentYieldPct: 3.5 },
  { id: "in-delhi", city: "New Delhi", country: "India", cagr10y: 4.2, rentYieldPct: 2.6 },
  { id: "in-kolkata", city: "Kolkata", country: "India", cagr10y: 3.8, rentYieldPct: 3.0 },

  // United States — 20 metros
  { id: "us-tampa", city: "Tampa", country: "United States", cagr10y: 11.0, rentYieldPct: 5.4 },
  { id: "us-orlando", city: "Orlando", country: "United States", cagr10y: 9.4, rentYieldPct: 5.2 },
  { id: "us-detroit", city: "Detroit", country: "United States", cagr10y: 9.1, rentYieldPct: 6.2 },
  { id: "us-phoenix", city: "Phoenix", country: "United States", cagr10y: 8.9, rentYieldPct: 5.0 },
  { id: "us-miami", city: "Miami", country: "United States", cagr10y: 8.8, rentYieldPct: 4.6 },
  { id: "us-seattle", city: "Seattle", country: "United States", cagr10y: 8.3, rentYieldPct: 3.8 },
  { id: "us-nashville", city: "Nashville", country: "United States", cagr10y: 8.0, rentYieldPct: 4.8 },
  { id: "us-charlotte", city: "Charlotte", country: "United States", cagr10y: 7.8, rentYieldPct: 5.1 },
  { id: "us-portland", city: "Portland", country: "United States", cagr10y: 7.7, rentYieldPct: 4.4 },
  { id: "us-denver", city: "Denver", country: "United States", cagr10y: 7.6, rentYieldPct: 4.3 },
  { id: "us-las-vegas", city: "Las Vegas", country: "United States", cagr10y: 7.4, rentYieldPct: 5.3 },
  { id: "us-atlanta", city: "Atlanta", country: "United States", cagr10y: 7.0, rentYieldPct: 5.0 },
  { id: "us-dallas", city: "Dallas", country: "United States", cagr10y: 6.8, rentYieldPct: 5.1 },
  { id: "us-san-diego", city: "San Diego", country: "United States", cagr10y: 6.2, rentYieldPct: 3.9 },
  { id: "us-los-angeles", city: "Los Angeles", country: "United States", cagr10y: 5.5, rentYieldPct: 3.6 },
  { id: "us-houston", city: "Houston", country: "United States", cagr10y: 4.8, rentYieldPct: 5.4 },
  { id: "us-boston", city: "Boston", country: "United States", cagr10y: 3.7, rentYieldPct: 4.0 },
  { id: "us-new-york", city: "New York", country: "United States", cagr10y: 3.5, rentYieldPct: 3.8 },
  { id: "us-chicago", city: "Chicago", country: "United States", cagr10y: 3.1, rentYieldPct: 5.2 },
  { id: "us-san-francisco", city: "San Francisco", country: "United States", cagr10y: 1.3, rentYieldPct: 3.4 },

  // Singapore
  { id: "sg-private", city: "Singapore (private)", country: "Singapore", cagr10y: 3.4, rentYieldPct: 3.2, note: "URA private residential PPI" },
  { id: "sg-hdb", city: "Singapore (HDB resale)", country: "Singapore", cagr10y: 4.3, rentYieldPct: 3.6, note: "HDB resale price index" },

  // Other markets
  { id: "uk-london", city: "London", country: "United Kingdom", cagr10y: 3.2, rentYieldPct: 3.5 },
  { id: "uk-manchester", city: "Manchester", country: "United Kingdom", cagr10y: 4.6, rentYieldPct: 4.8 },
  { id: "ca-toronto", city: "Toronto", country: "Canada", cagr10y: 6.8, rentYieldPct: 3.8 },
  { id: "ca-vancouver", city: "Vancouver", country: "Canada", cagr10y: 5.4, rentYieldPct: 3.5 },
  { id: "au-sydney", city: "Sydney", country: "Australia", cagr10y: 5.1, rentYieldPct: 3.2 },
  { id: "au-melbourne", city: "Melbourne", country: "Australia", cagr10y: 3.6, rentYieldPct: 3.4 },
  { id: "au-brisbane", city: "Brisbane", country: "Australia", cagr10y: 5.8, rentYieldPct: 3.8 },
  { id: "ae-dubai", city: "Dubai", country: "UAE", cagr10y: 5.5, rentYieldPct: 6.2, note: "Volatile; cycle-dependent" },
  { id: "ae-abu-dhabi", city: "Abu Dhabi", country: "UAE", cagr10y: 3.8, rentYieldPct: 5.8 },
  { id: "jp-tokyo", city: "Tokyo", country: "Japan", cagr10y: 2.8, rentYieldPct: 3.6 },
  { id: "jp-osaka", city: "Osaka", country: "Japan", cagr10y: 3.2, rentYieldPct: 4.0 },
  { id: "hk-hong-kong", city: "Hong Kong", country: "Hong Kong", cagr10y: -0.8, rentYieldPct: 2.8, note: "Soft decade after prior peak" },
  { id: "nz-auckland", city: "Auckland", country: "New Zealand", cagr10y: 5.2, rentYieldPct: 3.3 },
  { id: "de-berlin", city: "Berlin", country: "Germany", cagr10y: 4.1, rentYieldPct: 3.4 },
  { id: "nl-amsterdam", city: "Amsterdam", country: "Netherlands", cagr10y: 5.0, rentYieldPct: 3.6 },
  { id: "ie-dublin", city: "Dublin", country: "Ireland", cagr10y: 6.0, rentYieldPct: 4.2 },
];

export const CITY_HOUSING_COUNTRY_ORDER: CityHousingCountry[] = [
  "India",
  "United States",
  "Singapore",
  "United Kingdom",
  "Canada",
  "Australia",
  "UAE",
  "Japan",
  "Hong Kong",
  "New Zealand",
  "Germany",
  "Netherlands",
  "Ireland",
];

export function citiesByCountry(country: CityHousingCountry): CityHousingCagr[] {
  return CITY_HOUSING_CAGR.filter((c) => c.country === country);
}

export function findCityHousing(id: string): CityHousingCagr | undefined {
  return CITY_HOUSING_CAGR.find((c) => c.id === id);
}

export function suggestedMonthlyRent(propertyPrice: number, rentYieldPct: number): number {
  if (propertyPrice <= 0 || rentYieldPct <= 0) return 0;
  const monthly = (propertyPrice * rentYieldPct) / 100 / 12;
  if (monthly >= 10_000) return Math.round(monthly / 1000) * 1000;
  if (monthly >= 1000) return Math.round(monthly / 100) * 100;
  return Math.round(monthly);
}

export function typicalStampDutyPercent(country: CityHousingCountry): number {
  switch (country) {
    case "India":
      return 5;
    case "Singapore":
      return 3;
    case "United Kingdom":
      return 5;
    case "Australia":
      return 4;
    case "United States":
      return 1.5;
    default:
      return 2;
  }
}
