import { IMAGE_TOOLS } from "./imageTools";
import { PDF_TOOLS } from "./pdfTools";
import { SEO_TOOLS } from "./seoTools";
import { SOCIAL_TOOLS } from "./socialTools";
import { BUSINESS_TOOLS, QR_ALIAS_TOOL } from "./businessTools";

export const EXTENDED_TOOLS = [
  ...IMAGE_TOOLS,
  ...PDF_TOOLS,
  ...SEO_TOOLS,
  ...SOCIAL_TOOLS,
  ...BUSINESS_TOOLS,
  QR_ALIAS_TOOL,
];

export { IMAGE_TOOLS, PDF_TOOLS, SEO_TOOLS, SOCIAL_TOOLS, BUSINESS_TOOLS, QR_ALIAS_TOOL };
