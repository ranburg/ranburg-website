export type InvoiceCountry =
  | "IN"
  | "US"
  | "UK"
  | "CA"
  | "AU"
  | "SG"
  | "AE"
  | "DE"
  | "FR"
  | "NL";

export type TaxMode =
  | "gst_india"
  | "sales_tax"
  | "vat"
  | "gst_au"
  | "gst_sg"
  | "gst_ca"
  | "none";

export interface InvoiceCountryProfile {
  code: InvoiceCountry;
  label: string;
  currency: string;
  locale: string;
  taxMode: TaxMode;
  defaultTaxRate: number;
  taxRates: number[];
  sellerFields: { key: string; label: string; placeholder?: string; requiredHint?: boolean }[];
  clientFields: { key: string; label: string; placeholder?: string }[];
  taxLabels: {
    primary: string;
    splitA?: string;
    splitB?: string;
    exempt?: string;
  };
  showHsn: boolean;
  showIntraInter: boolean;
  notesPlaceholder: string;
}

export const INVOICE_COUNTRIES: InvoiceCountryProfile[] = [
  {
    code: "IN",
    label: "India",
    currency: "INR",
    locale: "en-IN",
    taxMode: "gst_india",
    defaultTaxRate: 18,
    taxRates: [0, 5, 12, 18, 28],
    sellerFields: [
      { key: "gstin", label: "GSTIN", placeholder: "22AAAAA0000A1Z5", requiredHint: true },
      { key: "pan", label: "PAN", placeholder: "ABCDE1234F" },
      { key: "lut", label: "LUT number", placeholder: "Optional LUT for zero-rated supplies" },
      { key: "placeOfSupply", label: "Place of supply", placeholder: "State / UT" },
    ],
    clientFields: [
      { key: "gstin", label: "Client GSTIN", placeholder: "Optional" },
      { key: "placeOfSupply", label: "Client state", placeholder: "State / UT" },
    ],
    taxLabels: { primary: "GST", splitA: "CGST", splitB: "SGST" },
    showHsn: true,
    showIntraInter: true,
    notesPlaceholder: "Bank details, payment terms, or LUT reference",
  },
  {
    code: "US",
    label: "United States",
    currency: "USD",
    locale: "en-US",
    taxMode: "sales_tax",
    defaultTaxRate: 0,
    taxRates: [0, 4, 5, 6, 7, 7.25, 8, 8.5, 9, 10],
    sellerFields: [
      { key: "ein", label: "EIN", placeholder: "XX-XXXXXXX" },
      { key: "state", label: "Business state", placeholder: "e.g. CA" },
      { key: "salesTaxId", label: "Sales tax / permit ID", placeholder: "Optional" },
    ],
    clientFields: [
      { key: "state", label: "Client state", placeholder: "e.g. NY" },
      { key: "taxExemptId", label: "Tax-exempt ID", placeholder: "Optional resale certificate #" },
    ],
    taxLabels: { primary: "Sales tax", exempt: "Tax exempt" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "ACH / wire details, net-30 terms, remittance address",
  },
  {
    code: "UK",
    label: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    taxMode: "vat",
    defaultTaxRate: 20,
    taxRates: [0, 5, 20],
    sellerFields: [
      { key: "vatNumber", label: "VAT number", placeholder: "GB123456789", requiredHint: true },
      { key: "companyNumber", label: "Company number", placeholder: "Optional" },
    ],
    clientFields: [
      { key: "vatNumber", label: "Client VAT number", placeholder: "Optional / reverse charge" },
    ],
    taxLabels: { primary: "VAT" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "Bank sort code / account, reverse charge note if applicable",
  },
  {
    code: "CA",
    label: "Canada",
    currency: "CAD",
    locale: "en-CA",
    taxMode: "gst_ca",
    defaultTaxRate: 5,
    taxRates: [0, 5, 13, 14, 15],
    sellerFields: [
      { key: "businessNumber", label: "Business number (BN)", placeholder: "123456789RT0001" },
      { key: "province", label: "Province", placeholder: "e.g. ON" },
    ],
    clientFields: [{ key: "province", label: "Client province", placeholder: "e.g. BC" }],
    taxLabels: { primary: "GST/HST", splitA: "GST", splitB: "PST/QST" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "Payment terms, GST/HST registration note",
  },
  {
    code: "AU",
    label: "Australia",
    currency: "AUD",
    locale: "en-AU",
    taxMode: "gst_au",
    defaultTaxRate: 10,
    taxRates: [0, 10],
    sellerFields: [
      { key: "abn", label: "ABN", placeholder: "XX XXX XXX XXX", requiredHint: true },
      { key: "acn", label: "ACN", placeholder: "Optional" },
    ],
    clientFields: [{ key: "abn", label: "Client ABN", placeholder: "Optional" }],
    taxLabels: { primary: "GST" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "BSB / account, payment terms",
  },
  {
    code: "SG",
    label: "Singapore",
    currency: "SGD",
    locale: "en-SG",
    taxMode: "gst_sg",
    defaultTaxRate: 9,
    taxRates: [0, 9],
    sellerFields: [
      { key: "uen", label: "UEN", placeholder: "Business UEN", requiredHint: true },
      { key: "gstReg", label: "GST registration no.", placeholder: "Optional if registered" },
    ],
    clientFields: [{ key: "uen", label: "Client UEN", placeholder: "Optional" }],
    taxLabels: { primary: "GST" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "PayNow / bank details, payment terms",
  },
  {
    code: "AE",
    label: "United Arab Emirates",
    currency: "AED",
    locale: "en-AE",
    taxMode: "vat",
    defaultTaxRate: 5,
    taxRates: [0, 5],
    sellerFields: [
      { key: "trn", label: "TRN", placeholder: "Tax Registration Number", requiredHint: true },
      { key: "tradeLicense", label: "Trade license", placeholder: "Optional" },
    ],
    clientFields: [{ key: "trn", label: "Client TRN", placeholder: "Optional" }],
    taxLabels: { primary: "VAT" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "Bank IBAN, payment terms",
  },
  {
    code: "DE",
    label: "Germany",
    currency: "EUR",
    locale: "de-DE",
    taxMode: "vat",
    defaultTaxRate: 19,
    taxRates: [0, 7, 19],
    sellerFields: [
      { key: "vatId", label: "USt-IdNr / VAT ID", placeholder: "DE123456789", requiredHint: true },
      { key: "handelsregister", label: "Handelsregister", placeholder: "Optional" },
    ],
    clientFields: [{ key: "vatId", label: "Client VAT ID", placeholder: "For reverse charge" }],
    taxLabels: { primary: "MwSt / VAT" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "IBAN / BIC, reverse charge (§13b) note if B2B EU",
  },
  {
    code: "FR",
    label: "France",
    currency: "EUR",
    locale: "fr-FR",
    taxMode: "vat",
    defaultTaxRate: 20,
    taxRates: [0, 5.5, 10, 20],
    sellerFields: [
      { key: "vatId", label: "N° TVA / VAT ID", placeholder: "FRXX123456789", requiredHint: true },
      { key: "siret", label: "SIRET", placeholder: "Optional" },
    ],
    clientFields: [{ key: "vatId", label: "Client VAT ID", placeholder: "For reverse charge" }],
    taxLabels: { primary: "TVA / VAT" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "IBAN, payment terms, reverse charge note if applicable",
  },
  {
    code: "NL",
    label: "Netherlands",
    currency: "EUR",
    locale: "nl-NL",
    taxMode: "vat",
    defaultTaxRate: 21,
    taxRates: [0, 9, 21],
    sellerFields: [
      { key: "vatId", label: "BTW-nummer / VAT ID", placeholder: "NL123456789B01", requiredHint: true },
      { key: "kvk", label: "KvK number", placeholder: "Optional" },
    ],
    clientFields: [{ key: "vatId", label: "Client VAT ID", placeholder: "For reverse charge" }],
    taxLabels: { primary: "BTW / VAT" },
    showHsn: false,
    showIntraInter: false,
    notesPlaceholder: "IBAN, payment terms, reverse charge note if applicable",
  },
];

export function getInvoiceCountry(code: InvoiceCountry): InvoiceCountryProfile {
  return INVOICE_COUNTRIES.find((c) => c.code === code) ?? INVOICE_COUNTRIES[0];
}

export function formatInvoiceMoney(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

export const INVOICE_COLOR_PRESETS = [
  { name: "Teal", accent: "#0f766e" },
  { name: "Navy", accent: "#1e3a5f" },
  { name: "Slate", accent: "#334155" },
  { name: "Forest", accent: "#166534" },
  { name: "Wine", accent: "#9f1239" },
  { name: "Indigo", accent: "#4338ca" },
] as const;
