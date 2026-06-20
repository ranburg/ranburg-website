import type { ComponentType } from "react";
import SIPCalculator from "./SIPCalculator";
import SWPCalculator from "./SWPCalculator";
import EMICalculator from "./EMICalculator";
import LTVCACCalculator from "./LTVCACCalculator";
import TwitchSubCalculator from "./TwitchSubCalculator";
import JSONFormatter from "./JSONFormatter";
import SQLFormatter from "./SQLFormatter";
import MinifierTool from "./MinifierTool";
import LinkedInFormatter from "./LinkedInFormatter";
import CaseConverter from "./CaseConverter";
import LoremIpsumGenerator from "./LoremIpsumGenerator";
import GlassmorphismGenerator from "./GlassmorphismGenerator";
import ImageConverter from "./ImageConverter";
import RegexTester from "./RegexTester";
import UUIDGenerator from "./UUIDGenerator";
import PasswordGenerator from "./PasswordGenerator";
import Base64Encoder from "./Base64Encoder";
import PDFTools from "./PDFTools";
import QRGenerator from "./QRGenerator";
import UnitConverter from "./UnitConverter";
import AgeCalculator from "./AgeCalculator";
import CurrencyConverter from "./CurrencyConverter";
import GSTCalculator from "./GSTCalculator";
import YouTubeChannelInsights from "./YouTubeChannelInsights";
import InstagramProfileInsights from "./InstagramProfileInsights";
import YouTubeRevenueCalculator from "./YouTubeRevenueCalculator";
import InstagramRevenueCalculator from "./InstagramRevenueCalculator";
import AdSenseRevenueCalculator from "./AdSenseRevenueCalculator";
import CronGenerator from "./salesforce/CronGenerator";
import FormulaGenerator from "./salesforce/FormulaGenerator";
import SOQLBuilder from "./salesforce/SOQLBuilder";
import ValidationRuleGenerator from "./salesforce/ValidationRuleGenerator";
import ApexTestGenerator from "./salesforce/ApexTestGenerator";
import FlowFormulaBuilder from "./salesforce/FlowFormulaBuilder";
import DateFormulaHelper from "./salesforce/DateFormulaHelper";
import GovernorLimitsCalculator from "./salesforce/GovernorLimitsCalculator";
import OmniStudioExpressionBuilder from "./salesforce/OmniStudioExpressionBuilder";
import RevenueCloudPricingCalculator from "./salesforce/RevenueCloudPricingCalculator";

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  sip: SIPCalculator,
  swp: SWPCalculator,
  emi: EMICalculator,
  "ltv-cac": LTVCACCalculator,
  "twitch-sub-revenue": TwitchSubCalculator,
  "json-formatter": JSONFormatter,
  "sql-formatter": SQLFormatter,
  minifier: MinifierTool,
  "linkedin-formatter": LinkedInFormatter,
  "case-converter": CaseConverter,
  "lorem-ipsum": LoremIpsumGenerator,
  "glassmorphism-generator": GlassmorphismGenerator,
  "image-converter": ImageConverter,
  "regex-tester": RegexTester,
  "uuid-generator": UUIDGenerator,
  "password-generator": PasswordGenerator,
  "base64-encoder": Base64Encoder,
  "pdf-tools": PDFTools,
  "qr-generator": QRGenerator,
  "unit-converter": UnitConverter,
  "age-calculator": AgeCalculator,
  "currency-converter": CurrencyConverter,
  "gst-calculator": GSTCalculator,
  "youtube-channel-insights": YouTubeChannelInsights,
  "instagram-profile-insights": InstagramProfileInsights,
  "youtube-revenue-calculator": YouTubeRevenueCalculator,
  "instagram-revenue-calculator": InstagramRevenueCalculator,
  "adsense-revenue-calculator": AdSenseRevenueCalculator,
  "cron-generator": CronGenerator,
  "formula-generator": FormulaGenerator,
  "soql-builder": SOQLBuilder,
  "validation-rule-generator": ValidationRuleGenerator,
  "apex-test-generator": ApexTestGenerator,
  "flow-formula-builder": FlowFormulaBuilder,
  "date-formula-helper": DateFormulaHelper,
  "governor-limits-calculator": GovernorLimitsCalculator,
  "omnistudio-expression-builder": OmniStudioExpressionBuilder,
  "revenue-cloud-pricing-calculator": RevenueCloudPricingCalculator,
};
