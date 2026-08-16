import { makeTool } from "./makeTool";
import type { ToolConfig } from "../toolsConfig";

const freeFaq = [
  { question: "Is this tool free?", answer: "Yes. All Ranburg tools are free with no signup." },
  { question: "Does my data leave the browser?", answer: "No. Processing runs locally on your device." },
  { question: "Can I use the output commercially?", answer: "Yes. Outputs are yours for personal or commercial use." },
  { question: "Does it work on mobile?", answer: "Yes, on modern mobile browsers. Large files may be slower on phones." },
];

export const CATALOG_TOOLS: ToolConfig[] = [
  makeTool({
    slug: "text-diff-checker",
    title: "Text Diff Checker",
    shortDescription:
      "Compare two texts side-by-side or inline. Highlight added, removed, and unchanged lines in your browser.",
    category: "developer",
    icon: "Diff",
    gradient: "from-indigo-500 to-blue-600",
    badge: "Developer Tool",
    popular: true,
    seoTitle: "Text Diff Checker - Free Online Tool | Ranburg",
    seoDescription:
      "Free online text diff checker. Compare two documents side-by-side or inline, highlight additions and deletions. No signup, runs in your browser.",
    keywords: [
      "text diff checker",
      "diff checker online",
      "compare two texts",
      "side by side diff",
      "inline diff viewer",
      "code diff online",
    ],
    howToUse: [
      "Paste the original text in the left (or first) panel.",
      "Paste the revised text in the right (or second) panel.",
      "Toggle side-by-side or inline view.",
      "Review added, removed, and unchanged lines.",
    ],
    formula: "Line-level LCS (longest common subsequence) diff; insertions and deletions highlighted per line",
    faq: [
      ...freeFaq,
      {
        question: "Is this a Git diff?",
        answer: "It uses the same idea (line-level comparison) but does not require Git. Paste any two texts or code snippets.",
      },
    ],
  }),
  makeTool({
    slug: "markdown-preview",
    title: "Markdown Live Preview",
    shortDescription:
      "Write Markdown and preview HTML instantly. Count words and copy rendered HTML — no signup.",
    category: "developer",
    icon: "BookOpen",
    gradient: "from-slate-600 to-zinc-700",
    badge: "Writer Tool",
    popular: true,
    seoTitle: "Markdown Live Preview - Free Online Tool | Ranburg",
    seoDescription:
      "Free Markdown live preview with word count and HTML copy. Write headings, lists, links, and code, then export HTML in your browser. No signup.",
    keywords: [
      "markdown live preview",
      "markdown to html",
      "markdown editor online",
      "md preview",
      "markdown word count",
    ],
    howToUse: [
      "Type or paste Markdown in the editor.",
      "Watch the live HTML preview update.",
      "Check word and character counts.",
      "Copy HTML or download a .html file.",
    ],
    formula: "CommonMark-style subset: headings, emphasis, lists, links, code, quotes → escaped HTML",
    faq: freeFaq,
  }),
  makeTool({
    slug: "screen-recorder",
    title: "Screen Recorder",
    shortDescription:
      "Record your screen in the browser and download a WebM video — no install, no watermark, no upload.",
    category: "productivity",
    icon: "Monitor",
    gradient: "from-rose-500 to-red-600",
    badge: "Productivity",
    popular: true,
    seoTitle: "Screen Recorder - Free Online Tool | Ranburg",
    seoDescription:
      "Free browser screen recorder. Capture a tab, window, or screen and download WebM locally — no install, no watermark, no signup.",
    keywords: [
      "screen recorder online",
      "browser screen recorder",
      "record screen no install",
      "webm screen capture",
      "free screen recorder",
    ],
    howToUse: [
      "Click Start recording and choose a tab, window, or entire screen.",
      "Optionally include system audio if your browser offers it.",
      "Click Stop when finished.",
      "Download the WebM file to your device.",
    ],
    formula: "getDisplayMedia() + MediaRecorder → WebM/VP8 or VP9 blob download",
    faq: [
      ...freeFaq,
      {
        question: "Why WebM instead of MP4?",
        answer: "Browsers natively record WebM. Convert with a local tool if you need MP4 for a specific editor.",
      },
    ],
  }),
  makeTool({
    slug: "resume-builder",
    title: "Resume Builder",
    shortDescription:
      "Build a clean, ATS-friendly resume with your details, then print or download a PDF in minutes.",
    category: "productivity",
    icon: "UserRound",
    gradient: "from-sky-500 to-blue-600",
    badge: "Career Tool",
    popular: true,
    seoTitle: "Resume Builder - Free Online Tool | Ranburg",
    seoDescription:
      "Free online resume builder. Fill in experience, education, and skills, then print or download a clean PDF. No signup, runs in your browser.",
    keywords: [
      "resume builder",
      "free resume builder",
      "cv maker online",
      "ats resume pdf",
      "resume generator",
    ],
    howToUse: [
      "Enter your name, contact, and professional summary.",
      "Add work experience, education, and skills.",
      "Preview the formatted resume.",
      "Print or download as PDF.",
    ],
    formula: "Structured resume fields → print-ready HTML layout → PDF via print or canvas capture",
    faq: freeFaq,
  }),
  makeTool({
    slug: "pdf-signer",
    title: "PDF Signer",
    shortDescription:
      "Sign a PDF in your browser — type a name or draw a signature, stamp it on the last page, and download.",
    category: "productivity",
    icon: "Stamp",
    gradient: "from-emerald-500 to-teal-600",
    badge: "Document Tool",
    seoTitle: "PDF Signer - Free Online Tool | Ranburg",
    seoDescription:
      "Free PDF signer online. Type or draw a signature, stamp it on your PDF, and download — files never leave your browser. No signup.",
    keywords: [
      "pdf signer",
      "sign pdf online",
      "electronic signature pdf",
      "draw signature on pdf",
      "free pdf sign",
    ],
    howToUse: [
      "Upload a PDF (processed locally).",
      "Type your name or draw a signature.",
      "Place it on the last page (or every page).",
      "Download the signed PDF.",
    ],
    formula: "pdf-lib embed PNG signature image → drawImage on target page(s)",
    faq: [
      ...freeFaq,
      {
        question: "Is this a legally binding e-sign?",
        answer:
          "It produces a visual signature on the PDF. Legal validity depends on your jurisdiction and the agreement. It is not a certified digital signature (PKI).",
      },
    ],
  }),
  makeTool({
    slug: "color-background-remover",
    title: "Color Background Remover",
    shortDescription:
      "Key out a background color from a photo and download a transparent PNG — chroma-key, fully in-browser.",
    category: "design",
    icon: "Eraser",
    gradient: "from-fuchsia-500 to-pink-600",
    badge: "Image Tool",
    seoTitle: "Color Background Remover - Free Online Tool | Ranburg",
    seoDescription:
      "Free color background remover. Pick a key color, tune tolerance, and download a transparent PNG. Chroma-key runs in your browser — no upload.",
    keywords: [
      "background remover",
      "remove background color",
      "chroma key online",
      "transparent png maker",
      "color key background",
    ],
    howToUse: [
      "Upload a photo with a solid or near-solid background.",
      "Click the background to sample the key color, or enter a hex value.",
      "Adjust tolerance until the subject is clean.",
      "Download a transparent PNG.",
    ],
    formula: "Per-pixel Euclidean RGB distance vs key color; alpha = 0 when distance ≤ tolerance",
    faq: [
      ...freeFaq,
      {
        question: "Is this AI background removal?",
        answer:
          "No. This is a chroma-key (color) remover — best for green screens, product shots, and solid backdrops. It does not detect people with a neural network.",
      },
    ],
  }),
];
