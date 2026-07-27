import { makeTool } from "./makeTool";
import type { ToolConfig } from "../toolsConfig";

const privacyFaq = [
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. Ranburg image tools process files locally in your browser whenever possible. Your images are not uploaded to our servers for storage.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "Most tools accept PNG, JPG/JPEG, WebP, and GIF. HEIC conversion depends on browser decode support. Check each tool page for format notes.",
  },
  {
    question: "Is this tool free?",
    answer: "Yes. Ranburg image tools are free forever with no signup, watermarks, or forced account.",
  },
  {
    question: "Can I use these tools on iPhone?",
    answer:
      "Yes. Open the tool in Safari or Chrome on iPhone, upload from Photos/Files, convert or edit, then save the result.",
  },
  {
    question: "Will converting reduce quality?",
    answer:
      "It depends on the target format. PNG is typically lossless for these workflows; JPG/WebP use quality settings. Always preview before downloading when quality matters.",
  },
];

const heicFaq = [
  ...privacyFaq,
  {
    question: "What is HEIC?",
    answer:
      "HEIC (High Efficiency Image Container) is the default iPhone photo format. It keeps excellent quality at smaller file sizes than JPG, but many Windows apps, email clients, and websites cannot open it.",
  },
  {
    question: "Is HEIC better than JPG?",
    answer:
      "HEIC is often better for iPhone storage. JPG is better for universal sharing — Windows, email, CMS uploads, and clients. Convert to JPG when compatibility matters more than file size.",
  },
  {
    question: "Can I convert multiple HEIC files?",
    answer:
      "Convert files one after another on this page, or repeat the upload step for each photo. Keeping conversion in-browser avoids uploading entire albums to unknown cloud converters.",
  },
  {
    question: "How do I open HEIC files on Windows?",
    answer:
      "Convert HEIC to JPG with this free tool, then open the JPG in any Windows photo viewer. Conversion is usually simpler than installing HEIF extensions for every recipient.",
  },
];

export const IMAGE_TOOLS: ToolConfig[] = [
  makeTool({
    slug: "jpg-to-png",
    title: "JPG to PNG Converter",
    shortDescription: "Convert JPG and JPEG images to PNG format instantly in your browser.",
    category: "design",
    icon: "Image",
    gradient: "from-orange-500 to-rose-500",
    badge: "Image Converter",
    popular: true,
    keywords: ["jpg to png", "jpeg to png", "convert jpg to png", "image converter", "jpg to png online free"],
    howToUse: ["Upload a JPG or JPEG file.", "Preview the converted PNG.", "Download the PNG file."],
    formula: "Canvas drawImage → toDataURL('image/png')",
    faq: privacyFaq,
    seoDescription:
      "Convert JPG to PNG online for free. Fast, secure, no software required. Turn JPEG photos into PNG images in your browser — no signup.",
  }),
  makeTool({
    slug: "png-to-jpg",
    title: "PNG to JPG Converter",
    shortDescription: "Convert PNG images to JPG/JPEG with adjustable quality.",
    category: "design",
    icon: "Image",
    gradient: "from-sky-500 to-blue-600",
    badge: "Image Converter",
    popular: true,
    keywords: ["png to jpg", "png to jpeg", "convert png to jpg", "png to jpg online free"],
    howToUse: ["Upload a PNG file.", "Adjust JPG quality if needed.", "Download the JPG file."],
    formula: "Canvas drawImage → toDataURL('image/jpeg', quality)",
    faq: privacyFaq,
    seoDescription:
      "Convert PNG to JPG online for free. Fast, secure browser conversion with quality control. No software install or signup required.",
  }),
  makeTool({
    slug: "webp-to-png",
    title: "WEBP to PNG Converter",
    shortDescription: "Convert WebP images to PNG for broader compatibility.",
    category: "design",
    icon: "Image",
    gradient: "from-emerald-500 to-teal-500",
    badge: "Image Converter",
    keywords: ["webp to png", "convert webp to png", "webp to png online free"],
    howToUse: ["Upload a WebP image.", "Preview the PNG output.", "Download PNG."],
    formula: "Canvas drawImage → toDataURL('image/png')",
    faq: privacyFaq,
    seoDescription:
      "Convert WEBP to PNG online for free. Make WebP images compatible with editors and platforms that need PNG — secure, no signup.",
  }),
  makeTool({
    slug: "png-to-webp",
    title: "PNG to WEBP Converter",
    shortDescription: "Convert PNG to WebP for smaller file sizes and faster websites.",
    category: "design",
    icon: "Image",
    gradient: "from-violet-500 to-purple-600",
    badge: "Image Converter",
    keywords: ["png to webp", "convert png to webp", "png to webp online free"],
    howToUse: ["Upload a PNG file.", "Set WebP quality.", "Download WebP."],
    formula: "Canvas drawImage → toDataURL('image/webp', quality)",
    faq: privacyFaq,
    seoDescription:
      "Convert PNG to WEBP online for free. Shrink image size for faster websites while keeping solid quality. No signup.",
  }),
  makeTool({
    slug: "image-compressor",
    title: "Image Compressor",
    shortDescription: "Compress JPG, PNG, and WebP images without uploading to a server.",
    category: "design",
    icon: "Minimize2",
    gradient: "from-amber-500 to-orange-500",
    badge: "Image Optimizer",
    popular: true,
    keywords: ["image compressor", "compress image online", "reduce image size", "compress jpg png"],
    howToUse: ["Upload an image.", "Adjust quality and max width.", "Compare size savings and download."],
    formula: "Resize + re-encode at lower quality → smaller byte size",
    faq: privacyFaq,
    seoDescription:
      "Compress images online for free. Reduce JPG, PNG, and WebP file size in your browser — fast, secure, no upload to our servers.",
  }),
  makeTool({
    slug: "image-resizer",
    title: "Image Resizer",
    shortDescription: "Resize images to exact width and height in pixels.",
    category: "design",
    icon: "Maximize2",
    gradient: "from-cyan-500 to-blue-500",
    badge: "Image Editor",
    keywords: ["image resizer", "resize image online", "scale image", "resize photo free"],
    howToUse: ["Upload an image.", "Enter target width and height.", "Maintain aspect ratio or stretch.", "Download resized image."],
    formula: "Canvas scale drawImage to target dimensions",
    faq: privacyFaq,
    seoDescription:
      "Resize images online for free. Set exact pixel width and height in your browser — no software or signup required.",
  }),
  makeTool({
    slug: "crop-image",
    title: "Crop Image",
    shortDescription: "Crop images to a custom region with live preview.",
    category: "design",
    icon: "Crop",
    gradient: "from-pink-500 to-rose-500",
    badge: "Image Editor",
    keywords: ["crop image online", "image cropper", "crop photo", "free image crop"],
    howToUse: ["Upload an image.", "Set crop X, Y, width, and height.", "Preview and download cropped image."],
    formula: "drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh)",
    faq: privacyFaq,
    seoDescription:
      "Crop images online for free with live preview. Trim photos in your browser — secure, no account required.",
  }),
  makeTool({
    slug: "image-to-base64",
    title: "Image to Base64 Converter",
    shortDescription: "Encode images to Base64 data URLs for HTML, CSS, and APIs.",
    category: "design",
    icon: "FileCode",
    gradient: "from-indigo-500 to-violet-500",
    badge: "Encoder",
    keywords: ["image to base64", "base64 image encoder", "data url generator"],
    howToUse: ["Upload an image.", "Copy the Base64 string or data URL.", "Paste into HTML img src or CSS."],
    formula: "FileReader / canvas.toDataURL → Base64 string",
    faq: privacyFaq,
    seoDescription:
      "Convert image to Base64 online for free. Generate data URLs for HTML, CSS, and APIs in your browser — no signup.",
  }),
  makeTool({
    slug: "base64-to-image",
    title: "Base64 to Image Decoder",
    shortDescription: "Decode Base64 strings back to downloadable image files.",
    category: "design",
    icon: "FileImage",
    gradient: "from-teal-500 to-emerald-500",
    badge: "Decoder",
    keywords: ["base64 to image", "decode base64 image", "base64 image decoder"],
    howToUse: ["Paste a Base64 or data URL string.", "Preview the decoded image.", "Download as PNG."],
    formula: "data URL → Image → canvas export",
    faq: privacyFaq,
    seoDescription:
      "Decode Base64 to image online for free. Paste a data URL, preview, and download PNG — fast and private in your browser.",
  }),
  makeTool({
    slug: "remove-exif",
    title: "Remove EXIF Metadata",
    shortDescription: "Strip EXIF metadata from photos by re-encoding in the browser.",
    category: "design",
    icon: "Shield",
    gradient: "from-slate-500 to-zinc-600",
    badge: "Privacy",
    keywords: ["remove exif", "strip image metadata", "remove photo metadata", "remove gps from photo"],
    howToUse: ["Upload a JPG or PNG photo.", "Re-encode strips most embedded metadata.", "Download the clean image."],
    formula: "Canvas re-draw removes EXIF; metadata not copied to output",
    faq: [
      ...privacyFaq,
      {
        question: "Does this remove GPS location?",
        answer:
          "Re-encoding via canvas typically removes EXIF including GPS. Always verify sensitive images before sharing.",
      },
    ],
    seoDescription:
      "Remove EXIF metadata online for free. Strip GPS and camera data by re-encoding photos in your browser — no signup.",
  }),
  makeTool({
    slug: "heic-to-jpg",
    title: "HEIC to JPG Converter",
    shortDescription: "Convert iPhone HEIC photos to JPG in your browser — free, fast, no signup.",
    category: "design",
    icon: "Smartphone",
    gradient: "from-blue-500 to-indigo-500",
    badge: "Image Converter",
    popular: true,
    keywords: [
      "heic to jpg",
      "convert heic to jpeg",
      "iphone photo converter",
      "heic to jpg online free",
      "heic converter",
      "convert heic to jpg",
      "open heic on windows",
    ],
    howToUse: [
      "Upload a .heic file from iPhone or Files.",
      "Wait a few seconds for browser conversion.",
      "Preview the JPG result.",
      "Download the high-quality JPG.",
    ],
    formula: "HEIC decode → canvas → JPEG export",
    faq: heicFaq,
    seoTitle: "HEIC to JPG Converter Online Free – Convert HEIC Images to JPG Instantly",
    seoDescription:
      "Convert HEIC to JPG online for free. Fast, secure, no software required. Turn iPhone HEIC photos into high-quality JPG files in seconds — no signup.",
  }),
  makeTool({
    slug: "svg-to-png",
    title: "SVG to PNG Converter",
    shortDescription: "Rasterize SVG vector graphics to PNG at custom resolution.",
    category: "design",
    icon: "Layers",
    gradient: "from-fuchsia-500 to-pink-500",
    badge: "Image Converter",
    keywords: ["svg to png", "convert svg to png", "rasterize svg", "svg to png online free"],
    howToUse: ["Upload an SVG file or paste SVG markup.", "Set output width.", "Download PNG."],
    formula: "SVG → Image → canvas → PNG",
    faq: privacyFaq,
    seoDescription:
      "Convert SVG to PNG online for free. Rasterize vector graphics at custom size in your browser — no software or signup.",
  }),
];
