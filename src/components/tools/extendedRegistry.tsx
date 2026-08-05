"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { IMAGE_FORMAT_CONFIGS } from "@/lib/imageProcessing";
import ImageFormatTool from "./image/ImageFormatTool";

const lazy = (loader: () => Promise<{ default: ComponentType }>) =>
  dynamic(loader, { ssr: false, loading: () => <div className="h-32 animate-pulse rounded-xl bg-theme-surface" /> });

const JPGToPng = () => <ImageFormatTool config={IMAGE_FORMAT_CONFIGS["jpg-to-png"]} />;
const PngToJpg = () => <ImageFormatTool config={IMAGE_FORMAT_CONFIGS["png-to-jpg"]} />;
const WebpToPng = () => <ImageFormatTool config={IMAGE_FORMAT_CONFIGS["webp-to-png"]} />;
const PngToWebp = () => <ImageFormatTool config={IMAGE_FORMAT_CONFIGS["png-to-webp"]} />;

export const EXTENDED_TOOL_COMPONENTS: Record<string, ComponentType> = {
  "jpg-to-png": JPGToPng,
  "png-to-jpg": PngToJpg,
  "webp-to-png": WebpToPng,
  "png-to-webp": PngToWebp,
  "image-compressor": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.ImageCompressorTool }))),
  "image-resizer": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.ImageResizerTool }))),
  "crop-image": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.CropImageTool }))),
  "image-to-base64": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.ImageToBase64Tool }))),
  "base64-to-image": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.Base64ToImageTool }))),
  "remove-exif": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.RemoveExifTool }))),
  "heic-to-jpg": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.HeicToJpgTool }))),
  "svg-to-png": lazy(() => import("./image/MoreImageTools").then((m) => ({ default: m.SvgToPngTool }))),

  "pdf-merge": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.PdfMergeTool }))),
  "pdf-split": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.PdfSplitTool }))),
  "pdf-compressor": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.PdfCompressorTool }))),
  "pdf-to-jpg": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.PdfToJpgTool }))),
  "jpg-to-pdf": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.JpgToPdfTool }))),
  "word-to-pdf": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.WordToPdfTool }))),
  "pdf-page-extractor": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.PdfPageExtractorTool }))),
  "pdf-page-remover": lazy(() => import("./pdf/PdfToolComponents").then((m) => ({ default: m.PdfPageRemoverTool }))),

  "keyword-density-checker": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.KeywordDensityTool }))),
  "meta-tag-generator": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.MetaTagGeneratorTool }))),
  "robots-txt-generator": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.RobotsTxtTool }))),
  "xml-sitemap-generator": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.XmlSitemapTool }))),
  "open-graph-generator": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.OpenGraphTool }))),
  "schema-markup-generator": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.SchemaMarkupTool }))),
  "url-encoder-decoder": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.UrlEncoderTool }))),
  "word-counter": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.WordCounterTool }))),
  "slug-generator": lazy(() => import("./seo/SeoToolComponents").then((m) => ({ default: m.SlugGeneratorTool }))),

  "youtube-tags-generator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.YoutubeTagsTool }))),
  "youtube-description-generator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.YoutubeDescriptionTool }))),
  "youtube-hashtag-generator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.YoutubeHashtagTool }))),
  "instagram-hashtag-generator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.InstagramHashtagTool }))),
  "instagram-engagement-calculator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.InstagramEngagementTool }))),
  "tiktok-engagement-calculator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.TiktokEngagementTool }))),
  "tiktok-earnings-calculator": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.TiktokEarningsTool }))),
  "social-media-character-counter": lazy(() => import("./social/SocialToolComponents").then((m) => ({ default: m.SocialCharacterCounterTool }))),

  "profit-margin-calculator": lazy(() => import("./business/BusinessCalcComponents").then((m) => ({ default: m.ProfitMarginTool }))),
  "roi-calculator": lazy(() => import("./business/BusinessCalcComponents").then((m) => ({ default: m.RoiCalculatorTool }))),
  "break-even-calculator": lazy(() => import("./business/BusinessCalcComponents").then((m) => ({ default: m.BreakEvenTool }))),

  "credit-card-finder": lazy(() => import("./finance/CreditCardFinderTool")),
  "rent-vs-buy-calculator": lazy(() => import("./finance/CoolFinanceTools").then((m) => ({ default: m.RentVsBuyTool }))),
  "bill-split-calculator": lazy(() => import("./finance/CoolFinanceTools").then((m) => ({ default: m.BillSplitTool }))),
  "compound-interest-calculator": lazy(() => import("./finance/CoolFinanceTools").then((m) => ({ default: m.CompoundInterestTool }))),
  "sleep-calculator": lazy(() => import("./finance/CoolFinanceTools").then((m) => ({ default: m.SleepCalculatorTool }))),
  "salary-hike-calculator": lazy(() => import("./finance/CoolFinanceTools").then((m) => ({ default: m.SalaryHikeTool }))),
  "color-contrast-checker": lazy(() => import("./finance/CoolFinanceTools").then((m) => ({ default: m.ColorContrastTool }))),

  "qr-code-generator": lazy(() => import("./QRGenerator")),

  "safe-zone-checker": lazy(() => import("./creators/CreatorQaTools").then((m) => ({ default: m.SafeZoneCheckerTool }))),
  "youtube-thumbnail-checker": lazy(() => import("./creators/CreatorQaTools").then((m) => ({ default: m.YoutubeThumbnailCheckerTool }))),
  "social-image-size-checker": lazy(() => import("./creators/CreatorQaTools").then((m) => ({ default: m.SocialImageSizeFitTool }))),
  "compress-to-exact-size": lazy(() => import("./creators/CreatorQaTools").then((m) => ({ default: m.CompressToExactSizeTool }))),
  "youtube-chapter-generator": lazy(() => import("./creators/CreatorQaTools").then((m) => ({ default: m.YoutubeChapterGeneratorTool }))),

  "avif-to-jpg": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.AvifToJpgTool }))),
  "jpg-to-avif": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.JpgToAvifTool }))),
  "opus-to-mp3": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.OpusToMp3Tool }))),
  "csv-to-json": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.CsvToJsonTool }))),
  "json-to-csv": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.JsonToCsvTool }))),
  "excel-to-csv": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.ExcelToCsvTool }))),
  "face-blur": lazy(() => import("./media/MediaUtilityTools").then((m) => ({ default: m.FaceBlurTool }))),

  "burn-rate-runway-calculator": lazy(() => import("./business/BizGrowthTools").then((m) => ({ default: m.BurnRateRunwayTool }))),
  "freelancer-hourly-rate-calculator": lazy(() => import("./business/BizGrowthTools").then((m) => ({ default: m.FreelancerRateTool }))),
  "ab-test-significance-calculator": lazy(() => import("./business/BizGrowthTools").then((m) => ({ default: m.AbTestSignificanceTool }))),
  "ai-crawler-robots-checker": lazy(() => import("./business/BizGrowthTools").then((m) => ({ default: m.AiCrawlerRobotsCheckerTool }))),
  "llms-txt-generator": lazy(() => import("./business/BizGrowthTools").then((m) => ({ default: m.LlmsTxtGeneratorTool }))),
  "jwt-decoder": lazy(() => import("./business/BizGrowthTools").then((m) => ({ default: m.JwtDecoderTool }))),

  "ctc-in-hand-calculator": lazy(() => import("./finance/IndiaFinanceTools").then((m) => ({ default: m.CtcInHandTool }))),
  "tds-calculator": lazy(() => import("./finance/IndiaFinanceTools").then((m) => ({ default: m.TdsCalculatorTool }))),
  "hra-exemption-calculator": lazy(() => import("./finance/IndiaFinanceTools").then((m) => ({ default: m.HraExemptionTool }))),
  "gratuity-calculator": lazy(() => import("./finance/IndiaFinanceTools").then((m) => ({ default: m.GratuityCalculatorTool }))),
  "hsn-sac-finder": lazy(() => import("./finance/IndiaFinanceTools").then((m) => ({ default: m.HsnSacFinderTool }))),
  "ifsc-finder": lazy(() => import("./finance/IndiaFinanceTools").then((m) => ({ default: m.IfscFinderTool }))),
};
