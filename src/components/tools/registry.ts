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
