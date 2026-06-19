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
};
