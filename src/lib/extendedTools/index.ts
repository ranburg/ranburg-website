import { IMAGE_TOOLS } from "./imageTools";
import { PDF_TOOLS } from "./pdfTools";
import { SEO_TOOLS } from "./seoTools";
import { SOCIAL_TOOLS } from "./socialTools";
import { BUSINESS_TOOLS, QR_ALIAS_TOOL } from "./businessTools";
import { COOL_FINANCE_TOOLS } from "./coolFinanceTools";
import { NEW_WAVE_TOOLS } from "./newWaveTools";
import { INDIA_FINANCE_TOOLS } from "./indiaFinanceTools";
import { CATALOG_TOOLS } from "./catalogTools";

export const EXTENDED_TOOLS = [
  ...IMAGE_TOOLS,
  ...PDF_TOOLS,
  ...SEO_TOOLS,
  ...SOCIAL_TOOLS,
  ...BUSINESS_TOOLS,
  QR_ALIAS_TOOL,
  ...COOL_FINANCE_TOOLS,
  ...NEW_WAVE_TOOLS,
  ...INDIA_FINANCE_TOOLS,
  ...CATALOG_TOOLS,
];

export {
  IMAGE_TOOLS,
  PDF_TOOLS,
  SEO_TOOLS,
  SOCIAL_TOOLS,
  BUSINESS_TOOLS,
  COOL_FINANCE_TOOLS,
  NEW_WAVE_TOOLS,
  INDIA_FINANCE_TOOLS,
  CATALOG_TOOLS,
  QR_ALIAS_TOOL,
};

