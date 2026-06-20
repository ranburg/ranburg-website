import { SALESFORCE_TOOLS } from "./salesforceToolsData";

export type ToolCategoryId = "financial" | "developer" | "productivity" | "design" | "salesforce";

export interface ToolCategory {
  id: ToolCategoryId;
  label: string;
  description: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolConfig {
  slug: string;
  title: string;
  shortDescription: string;
  category: ToolCategoryId;
  icon: string;
  gradient: string;
  badge: string;
  popular?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  howToUse: string[];
  formula: string;
  faq: ToolFaq[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "financial",
    label: "Financial Tools",
    description: "SIP, SWP, EMI, and investment planning calculators.",
  },
  {
    id: "developer",
    label: "Developer Tools",
    description: "JSON, SQL formatters and code utilities for developers.",
  },
  {
    id: "salesforce",
    label: "Salesforce Tools",
    description: "Free formula, SOQL, cron, Apex, and Revenue Cloud generators.",
  },
  {
    id: "design",
    label: "Design Tools",
    description: "CSS glassmorphism generator and image conversion utilities.",
  },
  {
    id: "productivity",
    label: "Productivity Tools",
    description: "Social analytics, QR codes, PDF tools, and professional helpers.",
  },
];

export const TOOLS_CONFIG: ToolConfig[] = [
  {
    slug: "sip",
    title: "SIP Calculator",
    shortDescription: "Calculate returns on monthly mutual fund investments over time.",
    category: "financial",
    icon: "TrendingUp",
    gradient: "from-blue-500 to-cyan-500",
    badge: "Wealth Builder",
    popular: true,
    seo: {
      title: "SIP Calculator — Systematic Investment Plan Returns | Ranburg.com",
      description:
        "Free SIP calculator with charts. Estimate total investment, returns, and maturity value for monthly mutual fund SIPs with inflation-adjusted purchasing power.",
      keywords: ["SIP calculator", "systematic investment plan", "mutual fund returns", "SIP returns India"],
    },
    howToUse: [
      "Set your monthly investment amount using the slider.",
      "Adjust the expected annual return rate based on your fund category.",
      "Choose the investment time period in years.",
      "Review total investment, estimated returns, and maturity value instantly.",
      "Enable Advanced Options to model inflation and see today's purchasing power.",
    ],
    formula:
      "Future Value (FV) = P × [(1 + r)^n − 1] / r × (1 + r), where P is monthly investment, r is monthly return rate, and n is number of months. Present Value adjusts for inflation: PV = FV / (1 + i)^t.",
    faq: [
      { question: "What is a SIP?", answer: "A Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly in mutual funds, leveraging rupee-cost averaging and compound growth." },
      { question: "What return rate should I use?", answer: "Equity funds historically average 10–12% annually, debt funds 6–8%. Past performance does not guarantee future results." },
      { question: "Does this include taxes?", answer: "No. Results are pre-tax estimates. Capital gains tax may apply on redemption based on holding period and fund type." },
    ],
  },
  {
    slug: "swp",
    title: "SWP Calculator",
    shortDescription: "Model systematic withdrawals with inflation-adjusted purchasing power.",
    category: "financial",
    icon: "Wallet",
    gradient: "from-emerald-500 to-teal-500",
    badge: "Retirement Income",
    popular: true,
    seo: {
      title: "Advanced SWP Calculator with Inflation Adjustment | Ranburg.com",
      description:
        "Calculate SWP corpus depletion, total withdrawals, and present value purchasing power. Advanced SWP calculator with inflation rate adjustment for retirement planning.",
      keywords: ["SWP calculator", "systematic withdrawal plan", "retirement income", "inflation adjusted SWP"],
    },
    howToUse: [
      "Enter your total investment corpus and desired monthly withdrawal.",
      "Set the expected annual return rate on remaining balance.",
      "Choose the withdrawal period in years.",
      "View nominal balance and today's purchasing power side by side.",
      "Open Advanced Options to set a custom inflation rate for PV calculations.",
    ],
    formula:
      "Each month: Balance = Balance × (1 + r) − Withdrawal. Present Value of a future amount: PV = FV / (1 + i)^n, where i is the annual inflation rate and n is years from today.",
    faq: [
      { question: "What is an SWP?", answer: "A Systematic Withdrawal Plan lets you withdraw a fixed amount regularly from your mutual fund investments while the remainder continues to grow." },
      { question: "Why show purchasing power?", answer: "Nominal rupee values in future years buy less due to inflation. Present value shows what those amounts are worth in today's terms." },
      { question: "What if my corpus runs out?", answer: "If withdrawals exceed growth, the balance reaches zero. Reduce withdrawal amount or extend the return assumption to sustain income longer." },
    ],
  },
  {
    slug: "emi",
    title: "Loan EMI Calculator",
    shortDescription: "Calculate monthly EMI, total interest, and payment breakdown.",
    category: "financial",
    icon: "Calculator",
    gradient: "from-amber-500 to-orange-500",
    badge: "Loan Planner",
    popular: true,
    seo: {
      title: "Loan EMI Calculator — Home, Car & Personal Loans | Ranburg.com",
      description:
        "Calculate monthly EMI, total interest payable, and yearly principal vs interest breakdown for any loan amount, rate, and tenure.",
      keywords: ["EMI calculator", "loan EMI", "home loan calculator", "car loan EMI"],
    },
    howToUse: [
      "Enter the loan principal amount.",
      "Set the annual interest rate offered by your lender.",
      "Choose tenure in years or months.",
      "View monthly EMI, total interest, and total payment.",
      "Use Advanced Options for inflation-adjusted total payment value.",
    ],
    formula:
      "EMI = P × r × (1 + r)^n / [(1 + r)^n − 1], where P is principal, r is monthly interest rate, and n is tenure in months.",
    faq: [
      { question: "What is EMI?", answer: "Equated Monthly Installment (EMI) is a fixed payment comprising principal and interest, spread evenly across the loan tenure." },
      { question: "Does EMI change over time?", answer: "The EMI amount stays fixed, but the principal-to-interest ratio shifts — early payments are interest-heavy." },
      { question: "Can I prepay my loan?", answer: "Most lenders allow prepayment. Reducing principal early lowers total interest, though prepayment charges may apply." },
    ],
  },
  {
    slug: "ltv-cac",
    title: "LTV / CAC Calculator",
    shortDescription: "Measure customer lifetime value against acquisition cost.",
    category: "financial",
    icon: "BarChart3",
    gradient: "from-violet-500 to-purple-500",
    badge: "SaaS Metrics",
    popular: true,
    seo: {
      title: "LTV CAC Ratio Calculator with Inflation Adjustment | Ranburg.com",
      description:
        "Calculate customer lifetime value, acquisition cost, LTV:CAC ratio, and inflation-adjusted future revenue for SaaS and subscription businesses.",
      keywords: ["LTV CAC calculator", "customer lifetime value", "CAC ratio", "SaaS metrics"],
    },
    howToUse: [
      "Enter average revenue per customer per month and gross margin percentage.",
      "Set average customer lifespan in months and monthly churn rate.",
      "Input total marketing spend and new customers acquired.",
      "Review LTV, CAC, ratio, and inflation-adjusted projections.",
    ],
    formula:
      "LTV = (ARPU × Gross Margin) / Churn Rate. CAC = Marketing Spend / New Customers. LTV:CAC Ratio = LTV / CAC. PV = FV / (1 + i)^n for inflation adjustment.",
    faq: [
      { question: "What is a good LTV:CAC ratio?", answer: "A ratio of 3:1 or higher is generally considered healthy for SaaS businesses, meaning each customer generates 3× their acquisition cost." },
      { question: "How does churn affect LTV?", answer: "Higher churn reduces customer lifespan, directly lowering lifetime value. Even small churn improvements significantly boost LTV." },
      { question: "Should I include sales salaries in CAC?", answer: "Yes. Fully-loaded CAC includes all sales and marketing costs divided by new customers acquired in the same period." },
    ],
  },
  {
    slug: "twitch-sub-revenue",
    title: "Twitch Sub Revenue Calculator",
    shortDescription: "Estimate Twitch subscription and ad revenue with growth projections.",
    category: "financial",
    icon: "Tv",
    gradient: "from-purple-500 to-pink-500",
    badge: "Creator Economy",
    seo: {
      title: "Twitch Sub Revenue Calculator with Inflation Projection | Ranburg.com",
      description:
        "Calculate Twitch Tier 1/2/3 sub revenue, ad income, and partner splits. Project creator earnings with inflation-adjusted purchasing power.",
      keywords: ["Twitch revenue calculator", "Twitch sub income", "streamer earnings", "Twitch partner revenue"],
    },
    howToUse: [
      "Enter subscriber counts for Tier 1, Tier 2, and Tier 3.",
      "Set your partner revenue share percentage (typically 50%).",
      "Add estimated monthly ad revenue and projected growth rate.",
      "View monthly and annual revenue with today's purchasing power equivalent.",
    ],
    formula:
      "Sub Revenue = Σ(Tier Count × Tier Price × Revenue Share). Annual = Monthly × 12 × (1 + growth)^years. PV = FV / (1 + inflation)^years.",
    faq: [
      { question: "How much does Twitch pay per sub?", answer: "Partners typically earn 50% of the subscription price: ~$2.50 for Tier 1 ($4.99), ~$5 for Tier 2 ($9.99), and ~$12.50 for Tier 3 ($24.99) in the US." },
      { question: "Do Prime subs count?", answer: "Prime Gaming subs are Tier 1 equivalents. They count toward sub count but may have different payout structures." },
      { question: "What about bits and donations?", answer: "This calculator focuses on sub and ad revenue. Bits pay $0.01 per bit to partners; donations via third-party platforms vary." },
    ],
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    shortDescription: "Format, validate, and beautify JSON with advanced options.",
    category: "developer",
    icon: "Braces",
    gradient: "from-cyan-500 to-blue-500",
    badge: "Data Utility",
    popular: true,
    seo: {
      title: "JSON Formatter & Validator — Beautify JSON Online | Ranburg.com",
      description:
        "Free online JSON formatter and validator. Beautify, minify, sort keys, and validate JSON with custom indentation and one-click copy.",
      keywords: ["JSON formatter", "JSON validator", "JSON beautifier", "format JSON online"],
    },
    howToUse: [
      "Paste your JSON into the input panel.",
      "Click Format to beautify or Validate to check syntax.",
      "Open Advanced Options for indent size, key sorting, and minify mode.",
      "Copy the result with one click and get instant success feedback.",
    ],
    formula:
      "Parsing uses JSON.parse() for validation. Formatting applies JSON.stringify(value, replacer, space) where space controls indentation depth.",
    faq: [
      { question: "Can I format invalid JSON?", answer: "No. The validator will highlight the syntax error location. Fix errors before formatting." },
      { question: "Does it support JSON with comments?", answer: "Standard JSON does not support comments. Enable 'Lenient Mode' in Advanced Options to strip // and /* */ comments before parsing." },
      { question: "Is my data sent to a server?", answer: "No. All processing happens client-side in your browser. Your data never leaves your device." },
    ],
  },
  {
    slug: "sql-formatter",
    title: "SQL Query Formatter",
    shortDescription: "Beautify and structure SQL queries for readability.",
    category: "developer",
    icon: "Database",
    gradient: "from-indigo-500 to-blue-500",
    badge: "Query Tool",
    seo: {
      title: "SQL Formatter — Beautify SQL Queries Online | Ranburg.com",
      description:
        "Format SQL queries with keyword capitalization, line breaks, and custom indentation. Free online SQL beautifier for developers.",
      keywords: ["SQL formatter", "SQL beautifier", "format SQL online", "SQL pretty print"],
    },
    howToUse: [
      "Paste your SQL query into the input area.",
      "Click Format to apply keyword casing and indentation.",
      "Use Advanced Options to choose uppercase/lowercase keywords and indent width.",
      "Copy the formatted query with one-click feedback.",
    ],
    formula:
      "Tokenizes SQL by keywords (SELECT, FROM, WHERE, JOIN, etc.), applies casing rules, and inserts line breaks before major clauses with configurable indentation.",
    faq: [
      { question: "Which SQL dialects are supported?", answer: "The formatter handles standard ANSI SQL keywords. Dialect-specific syntax (T-SQL, PL/pgSQL) is supported for basic formatting." },
      { question: "Will it change my query logic?", answer: "No. Formatting only adjusts whitespace and keyword casing. Query semantics remain identical." },
      { question: "Can I minify SQL?", answer: "Yes. Enable Minify Mode in Advanced Options to collapse whitespace for compact storage." },
    ],
  },
  {
    slug: "minifier",
    title: "HTML / CSS / JS Minifier",
    shortDescription: "Minify HTML, CSS, and JavaScript for production.",
    category: "developer",
    icon: "FileCode",
    gradient: "from-orange-500 to-red-500",
    badge: "Performance",
    seo: {
      title: "HTML CSS JS Minifier — Compress Code Online | Ranburg.com",
      description:
        "Minify HTML, CSS, and JavaScript online. Reduce file size, preserve comments optionally, and copy minified output instantly.",
      keywords: ["HTML minifier", "CSS minifier", "JS minifier", "code compression"],
    },
    howToUse: [
      "Select the code type: HTML, CSS, or JavaScript.",
      "Paste your source code into the input panel.",
      "Toggle Advanced Options for comment preservation and compression level.",
      "Copy minified output and see size reduction percentage.",
    ],
    formula:
      "Minification removes non-essential whitespace, line breaks, and optionally comments while preserving code functionality and string literals.",
    faq: [
      { question: "Is minification safe?", answer: "Yes for production code. Always keep an unminified source copy for development and debugging." },
      { question: "How much size reduction can I expect?", answer: "Typically 20–60% depending on code style, comment density, and whitespace usage." },
      { question: "Does it obfuscate variable names?", answer: "This tool performs whitespace and comment removal only. It does not rename variables or obfuscate logic." },
    ],
  },
  {
    slug: "linkedin-formatter",
    title: "LinkedIn Formatting & Hook Previewer",
    shortDescription: "Preview LinkedIn posts with hook analysis and formatting.",
    category: "productivity",
    icon: "Linkedin",
    gradient: "from-blue-600 to-blue-400",
    badge: "Social Copy",
    seo: {
      title: "LinkedIn Post Formatter & Hook Previewer | Ranburg.com",
      description:
        "Format LinkedIn posts with bold Unicode, preview hooks, analyze character count, and optimize your professional content for engagement.",
      keywords: ["LinkedIn formatter", "LinkedIn hook preview", "LinkedIn post tool", "LinkedIn bold text"],
    },
    howToUse: [
      "Write or paste your LinkedIn post in the editor.",
      "See a live preview with hook line highlighted.",
      "Check character count against LinkedIn's 3,000 character limit.",
      "Use formatting shortcuts for bold, italic, and line breaks.",
    ],
    formula:
      "Hook score = f(first-line length, question presence, number usage, line breaks before fold). Character count uses Unicode-aware length for LinkedIn limits.",
    faq: [
      { question: "What makes a good LinkedIn hook?", answer: "Strong hooks are under 150 characters, create curiosity, and appear before the 'see more' fold. Questions and specific numbers boost engagement." },
      { question: "Can I use bold text on LinkedIn?", answer: "LinkedIn doesn't support HTML bold. This tool generates Unicode mathematical bold characters that render as visually bold on LinkedIn." },
      { question: "What is the ideal post length?", answer: "Posts between 1,200–1,900 characters tend to perform well. Hooks should capture attention within the first 2 lines." },
    ],
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    shortDescription: "Convert text between camelCase, snake_case, Title Case, and more.",
    category: "productivity",
    icon: "Type",
    gradient: "from-teal-500 to-green-500",
    badge: "Text Utility",
    seo: {
      title: "Case Converter — camelCase, snake_case, Title Case | Ranburg.com",
      description:
        "Convert text between uppercase, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase instantly.",
      keywords: ["case converter", "camelCase converter", "snake_case", "title case converter"],
    },
    howToUse: [
      "Paste or type your text in the input field.",
      "Click any case style button to convert instantly.",
      "View all case variations simultaneously in the output grid.",
      "Copy any result with one-click feedback.",
    ],
    formula:
      "Case transforms apply Unicode-aware rules: word splitting on spaces/underscores/hyphens, then recombination per target convention (camel, snake, kebab, Pascal, title).",
    faq: [
      { question: "What is camelCase?", answer: "camelCase joins words without spaces, lowercase first word, capitalizing subsequent words: myVariableName." },
      { question: "When should I use snake_case?", answer: "snake_case is common in Python, Ruby, and database column names: my_variable_name." },
      { question: "Does it handle special characters?", answer: "Non-alphanumeric characters are treated as word separators. Accented characters are preserved." },
    ],
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    shortDescription: "Generate placeholder paragraphs, sentences, or words.",
    category: "productivity",
    icon: "AlignLeft",
    gradient: "from-slate-500 to-slate-400",
    badge: "Placeholder",
    seo: {
      title: "Lorem Ipsum Generator — Placeholder Text | Ranburg.com",
      description:
        "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Copy instantly for design mockups and development.",
      keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "lipsum"],
    },
    howToUse: [
      "Choose output type: paragraphs, sentences, or words.",
      "Set the quantity using the slider.",
      "Click Generate to create fresh placeholder text.",
      "Copy the output with one-click feedback.",
    ],
    formula:
      "Randomized selection from classic Lorem Ipsum word pool with configurable count. Sentences end with periods; paragraphs separated by double line breaks.",
    faq: [
      { question: "What is Lorem Ipsum?", answer: "Lorem Ipsum is standard placeholder text used in design and publishing since the 1500s to demonstrate layout without meaningful content." },
      { question: "Can I generate HTML paragraphs?", answer: "Enable 'HTML Output' in Advanced Options to wrap each paragraph in <p> tags." },
      { question: "Is the text random each time?", answer: "Yes. Each generation produces a unique combination from the Lorem Ipsum word corpus." },
    ],
  },
  {
    slug: "glassmorphism-generator",
    title: "CSS Glassmorphism Generator",
    shortDescription: "Generate glassmorphism CSS with live preview.",
    category: "design",
    icon: "Sparkles",
    gradient: "from-sky-500 to-indigo-500",
    badge: "CSS Tool",
    seo: {
      title: "CSS Glassmorphism Generator — Live Preview | Ranburg.com",
      description:
        "Generate glassmorphism CSS code with adjustable blur, opacity, border, and shadow. Live preview and one-click copy for modern UI design.",
      keywords: ["glassmorphism generator", "CSS glass effect", "frosted glass CSS", "backdrop filter generator"],
    },
    howToUse: [
      "Adjust blur, background opacity, border opacity, and border radius sliders.",
      "See the glass effect update in the live preview panel.",
      "Copy the generated CSS with one click.",
      "Use Advanced Options for custom background color and shadow intensity.",
    ],
    formula:
      "Glassmorphism CSS: backdrop-filter: blur(Npx); background: rgba(R,G,B,opacity); border: 1px solid rgba(255,255,255,borderOpacity); box-shadow for depth.",
    faq: [
      { question: "What is glassmorphism?", answer: "Glassmorphism is a UI trend using frosted-glass effects via backdrop-filter blur, semi-transparent backgrounds, and subtle borders." },
      { question: "Which browsers support backdrop-filter?", answer: "All modern browsers support backdrop-filter. Safari requires -webkit-backdrop-filter prefix, included in generated code." },
      { question: "Can I use this in Tailwind?", answer: "Copy the raw CSS values into your Tailwind config or use arbitrary values: backdrop-blur-[12px] bg-white/10." },
    ],
  },
  {
    slug: "image-converter",
    title: "Image to WebP / Base64 Converter",
    shortDescription: "Convert images to WebP or Base64 data URIs client-side.",
    category: "design",
    icon: "Image",
    gradient: "from-rose-500 to-pink-500",
    badge: "Media Tool",
    seo: {
      title: "Image to WebP & Base64 Converter Online | Ranburg.com",
      description:
        "Convert images to WebP format or Base64 data URIs in your browser. Adjust quality, preview results, and copy output instantly. No upload to server.",
      keywords: ["image to webp", "base64 image converter", "image to base64", "webp converter online"],
    },
    howToUse: [
      "Upload an image file (PNG, JPG, GIF, WebP).",
      "Choose output format: WebP download or Base64 string.",
      "Adjust quality and max width in Advanced Options.",
      "Preview the result and copy or download instantly.",
    ],
    formula:
      "Canvas API draws the image at target dimensions. toDataURL('image/webp', quality) produces Base64; blob conversion enables WebP file download.",
    faq: [
      { question: "Are my images uploaded to a server?", answer: "No. All conversion happens locally in your browser using the Canvas API. Your images never leave your device." },
      { question: "Why use WebP?", answer: "WebP offers 25–35% smaller file sizes than JPEG/PNG at similar quality, improving page load speed and Core Web Vitals." },
      { question: "What is a Base64 data URI?", answer: "A Base64 data URI embeds image data directly in HTML/CSS as a string, eliminating separate HTTP requests for small images." },
    ],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    shortDescription: "Test regular expressions with live match highlighting and capture groups.",
    category: "developer",
    icon: "Regex",
    gradient: "from-fuchsia-500 to-purple-500",
    badge: "Pattern Match",
    popular: true,
    seo: {
      title: "Regex Tester — Test Regular Expressions Online | Ranburg.com",
      description:
        "Free online regex tester with live match highlighting, capture groups, and flag support. Debug JavaScript regular expressions instantly in your browser.",
      keywords: ["regex tester", "regular expression tester", "regex online", "test regex"],
    },
    howToUse: [
      "Enter your regular expression pattern.",
      "Add test text in the input area.",
      "Toggle flags (global, case-insensitive, multiline, dotall).",
      "Review matches, groups, and match count in real time.",
    ],
    formula: "Uses JavaScript RegExp engine: new RegExp(pattern, flags).exec() iterates matches; match.index and match.groups expose positions and captures.",
    faq: [
      { question: "Which regex flavor is supported?", answer: "JavaScript (ECMAScript) regular expressions — the same engine used in browsers and Node.js." },
      { question: "Can I test replace operations?", answer: "Yes. Enter a replacement string in Advanced Options to preview the replaced output." },
      { question: "Is my data sent to a server?", answer: "No. All regex testing runs locally in your browser." },
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    shortDescription: "Generate RFC 4122 v4 UUIDs instantly with bulk copy support.",
    category: "developer",
    icon: "Fingerprint",
    gradient: "from-violet-500 to-indigo-500",
    badge: "ID Generator",
    popular: true,
    seo: {
      title: "UUID Generator — Generate v4 UUIDs Online | Ranburg.com",
      description:
        "Generate cryptographically random UUID v4 identifiers. Create single or bulk UUIDs with uppercase/lowercase formatting and one-click copy.",
      keywords: ["UUID generator", "GUID generator", "generate UUID v4", "random UUID"],
    },
    howToUse: [
      "Click Generate to create a new UUID v4.",
      "Set quantity in Advanced Options for bulk generation.",
      "Choose uppercase or lowercase formatting.",
      "Copy individual UUIDs or all at once.",
    ],
    formula: "UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y ∈ {8,9,a,b} and other digits are random hex from crypto.getRandomValues().",
    faq: [
      { question: "Are these UUIDs cryptographically secure?", answer: "Yes. This tool uses crypto.getRandomValues() for randomness, suitable for database keys and session IDs." },
      { question: "What is UUID v4?", answer: "Version 4 UUIDs are randomly generated 128-bit identifiers with extremely low collision probability." },
      { question: "Can I generate bulk UUIDs?", answer: "Yes. Set quantity up to 100 in Advanced Options and copy the full list." },
    ],
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    shortDescription: "Create strong random passwords with customizable character sets.",
    category: "developer",
    icon: "KeyRound",
    gradient: "from-red-500 to-orange-500",
    badge: "Security",
    popular: true,
    seo: {
      title: "Password Generator — Strong Random Passwords | Ranburg.com",
      description:
        "Generate secure random passwords with custom length, uppercase, lowercase, numbers, and symbols. Strength meter and one-click copy.",
      keywords: ["password generator", "strong password", "random password", "secure password generator"],
    },
    howToUse: [
      "Set desired password length (8–64 characters).",
      "Toggle character types: uppercase, lowercase, numbers, symbols.",
      "Click Generate for a new password.",
      "Copy instantly and check the strength indicator.",
    ],
    formula: "Characters sampled uniformly from selected charset using crypto.getRandomValues(). Strength score based on length, charset size, and entropy estimate.",
    faq: [
      { question: "How long should my password be?", answer: "At least 12–16 characters with mixed character types is recommended for most accounts." },
      { question: "Are passwords stored anywhere?", answer: "No. Passwords are generated locally in your browser and never transmitted." },
      { question: "Can I exclude ambiguous characters?", answer: "Yes. Enable 'Exclude ambiguous' in Advanced Options to omit 0/O, 1/l/I, etc." },
    ],
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder / Decoder",
    shortDescription: "Encode and decode text or files to Base64 instantly.",
    category: "developer",
    icon: "Binary",
    gradient: "from-lime-500 to-green-500",
    badge: "Encoding",
    popular: true,
    seo: {
      title: "Base64 Encoder Decoder — Encode Decode Online | Ranburg.com",
      description:
        "Free Base64 encoder and decoder for text and files. URL-safe mode, UTF-8 support, and one-click copy. All processing in your browser.",
      keywords: ["base64 encoder", "base64 decoder", "encode base64", "decode base64 online"],
    },
    howToUse: [
      "Choose Encode or Decode mode.",
      "Paste text or upload a file.",
      "View output instantly with line-wrap options.",
      "Copy result with one click.",
    ],
    formula: "Encoding: btoa(unescape(encodeURIComponent(text))) for UTF-8. Decoding: decodeURIComponent(escape(atob(base64))). URL-safe replaces +/ with -_.",
    faq: [
      { question: "Does it support UTF-8?", answer: "Yes. Unicode text including emoji is encoded and decoded correctly." },
      { question: "What is URL-safe Base64?", answer: "URL-safe Base64 replaces + with - and / with _ so the string can be used in URLs without encoding." },
      { question: "Can I encode files?", answer: "Yes. Upload any file to get its Base64 representation without sending it to a server." },
    ],
  },
  {
    slug: "pdf-tools",
    title: "PDF Tools — Merge & Split",
    shortDescription: "Merge multiple PDFs or extract pages — 100% client-side.",
    category: "productivity",
    icon: "FileText",
    gradient: "from-red-600 to-rose-500",
    badge: "Document",
    seo: {
      title: "PDF Tools — Merge & Split PDF Online Free | Ranburg.com",
      description:
        "Merge multiple PDF files into one or extract specific pages. Free online PDF tools that run entirely in your browser — no upload to server.",
      keywords: ["merge PDF", "split PDF", "PDF tools online", "combine PDF free"],
    },
    howToUse: [
      "Select Merge or Extract Pages mode.",
      "Upload one or more PDF files.",
      "For extract: enter page numbers (e.g. 1,3,5-7).",
      "Download the resulting PDF instantly.",
    ],
    formula: "PDF manipulation uses pdf-lib: PDFDocument.load() merges pages via copyPages(); extract filters page indices before save().",
    faq: [
      { question: "Are my PDFs uploaded?", answer: "No. All PDF processing happens locally in your browser using pdf-lib." },
      { question: "Is there a file size limit?", answer: "Browser memory limits apply — typically 50–100 MB total works well on modern devices." },
      { question: "Can I reorder pages?", answer: "Merge mode preserves upload order. Use extract to pull specific pages into a new file." },
    ],
  },
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    shortDescription: "Create QR codes for URLs, text, WiFi, and contact info.",
    category: "productivity",
    icon: "QrCode",
    gradient: "from-neutral-700 to-neutral-900",
    badge: "QR Code",
    popular: true,
    seo: {
      title: "QR Code Generator — Free QR Code Maker | Ranburg.com",
      description:
        "Generate QR codes for URLs, plain text, phone numbers, and WiFi credentials. Customize size and download as PNG. No signup required.",
      keywords: ["QR code generator", "create QR code", "QR maker", "free QR code"],
    },
    howToUse: [
      "Enter a URL or text to encode.",
      "Adjust QR code size and error correction level.",
      "Preview the QR code instantly.",
      "Download as PNG or copy the image.",
    ],
    formula: "QR encoding follows ISO/IEC 18004 with Reed-Solomon error correction. Rendered to canvas for PNG export.",
    faq: [
      { question: "What can I encode?", answer: "URLs, plain text, phone numbers (tel:), emails (mailto:), and WiFi credentials (WIFI:T:WPA;S:name;P:pass;;)." },
      { question: "Will the QR code expire?", answer: "No. Static QR codes encode your data directly and work indefinitely." },
      { question: "What error correction should I use?", answer: "Medium (M) is default. Use High (H) for logos or damaged print; Low (L) for maximum data capacity." },
    ],
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    shortDescription: "Convert length, weight, temperature, volume, area, and speed units.",
    category: "productivity",
    icon: "Ruler",
    gradient: "from-cyan-600 to-blue-500",
    badge: "Converter",
    popular: true,
    seo: {
      title: "Unit Converter — Length, Weight, Temperature & More | Ranburg.com",
      description:
        "Free online unit converter for length, weight, temperature, volume, area, and speed. Instant conversions with common and metric units.",
      keywords: ["unit converter", "length converter", "temperature converter", "kg to lbs"],
    },
    howToUse: [
      "Select a category: length, weight, temperature, volume, area, or speed.",
      "Enter a value in the 'from' unit.",
      "Choose the target unit — result updates instantly.",
      "Swap units with one click.",
    ],
    formula: "Conversions use standard factors: value × (fromBase / toBase). Temperature uses affine transforms: °F = °C × 9/5 + 32.",
    faq: [
      { question: "Which units are supported?", answer: "Metric and imperial: meters, feet, miles, kg, lbs, °C/°F/K, liters, gallons, sq meters, sq feet, km/h, mph, and more." },
      { question: "How accurate are conversions?", answer: "Uses standard conversion factors with up to 6 decimal places displayed." },
      { question: "Can I convert multiple values?", answer: "Change the input value anytime — output updates in real time." },
    ],
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    shortDescription: "Calculate exact age in years, months, days, and total days lived.",
    category: "financial",
    icon: "Cake",
    gradient: "from-pink-500 to-rose-400",
    badge: "Date Tool",
    seo: {
      title: "Age Calculator — Calculate Age from Date of Birth | Ranburg.com",
      description:
        "Calculate your exact age in years, months, and days from your date of birth. See next birthday countdown and total days lived.",
      keywords: ["age calculator", "calculate age", "date of birth calculator", "how old am I"],
    },
    howToUse: [
      "Enter your date of birth.",
      "Optionally set a 'calculate as of' date (defaults to today).",
      "View age in years, months, and days.",
      "See days until next birthday and total days lived.",
    ],
    formula: "Age computed by calendar difference: subtract years, then months, then days with borrow adjustment for month-end edge cases.",
    faq: [
      { question: "Does it handle leap years?", answer: "Yes. February 29 birthdays and leap years are handled correctly." },
      { question: "Can I calculate age on a past date?", answer: "Yes. Set the 'as of' date to any future or past date." },
      { question: "What timezone is used?", answer: "Dates are interpreted in your local timezone at midnight." },
    ],
  },
  {
    slug: "currency-converter",
    title: "Currency Converter",
    shortDescription: "Convert world currencies with live exchange rates.",
    category: "financial",
    icon: "CircleDollarSign",
    gradient: "from-green-600 to-emerald-500",
    badge: "Forex",
    popular: true,
    seo: {
      title: "Currency Converter — Live Exchange Rates | Ranburg.com",
      description:
        "Convert between 30+ world currencies with live ECB exchange rates. Free currency converter with amount swap and rate display.",
      keywords: ["currency converter", "exchange rate", "USD to INR", "forex converter"],
    },
    howToUse: [
      "Select source and target currencies.",
      "Enter an amount to convert.",
      "View converted amount and current exchange rate.",
      "Swap currencies with one click.",
    ],
    formula: "converted = amount × (rate[to] / rate[from]) using ECB reference rates via Frankfurter API.",
    faq: [
      { question: "How often are rates updated?", answer: "Exchange rates are fetched from the European Central Bank via Frankfurter API, updated on business days." },
      { question: "Is this for bank transactions?", answer: "Rates are indicative reference rates. Banks may apply spreads and fees." },
      { question: "Which currencies are supported?", answer: "30+ major currencies including USD, EUR, GBP, INR, JPY, AUD, CAD, and CHF." },
    ],
  },
  {
    slug: "gst-calculator",
    title: "GST Calculator (India)",
    shortDescription: "Calculate GST inclusive and exclusive amounts for India tax rates.",
    category: "financial",
    icon: "Percent",
    gradient: "from-indigo-600 to-violet-600",
    badge: "India Tax",
    popular: true,
    seo: {
      title: "GST Calculator India — Inclusive & Exclusive GST | Ranburg.com",
      description:
        "Free India GST calculator for 5%, 12%, 18%, and 28% rates. Calculate GST amount, net price, and gross total for inclusive or exclusive pricing.",
      keywords: ["GST calculator", "GST calculator India", "18% GST calculator", "inclusive GST"],
    },
    howToUse: [
      "Use Quick Calculator for single amounts or Multi-Line Invoice for itemized bills.",
      "Choose intra-state (CGST+SGST) or inter-state (IGST) tax type.",
      "Toggle GST-inclusive or GST-exclusive pricing.",
      "Add HSN/SAC codes and multiple line items with per-line GST rates.",
      "Apply cess if applicable in Advanced Options.",
    ],
    formula: "Exclusive: GST = amount × rate/100. Inclusive: net = amount / (1 + rate/100). Multi-line: sum per item with CGST/SGST split or IGST.",
    faq: [
      { question: "What GST rates are supported?", answer: "Standard India GST slabs: 0%, 5%, 12%, 18%, and 28% per line item." },
      { question: "What is CGST and SGST?", answer: "For intra-state sales, GST splits equally into CGST (central) and SGST (state), each half the total GST." },
      { question: "When do I use IGST?", answer: "For inter-state transactions, the full GST amount is IGST. Select Inter-state mode in the calculator." },
      { question: "Can I calculate multi-item invoices?", answer: "Yes. Switch to Multi-Line Invoice mode to add items with HSN codes, quantities, and per-line GST rates." },
      { question: "What is HSN/SAC?", answer: "Harmonized System of Nomenclature (goods) or Services Accounting Code — required for GST invoices and e-way bills." },
    ],
  },
  {
    slug: "youtube-channel-insights",
    title: "YouTube Channel Analytics",
    shortDescription: "Analyze any public YouTube channel — subscribers, views, revenue estimates, and growth charts.",
    category: "productivity",
    icon: "Youtube",
    gradient: "from-red-600 to-red-500",
    badge: "Social Analytics",
    popular: true,
    seo: {
      title: "YouTube Channel Analytics — Free Channel Stats Checker | Ranburg.com",
      description:
        "Free YouTube channel analytics tool. Enter a channel handle or URL to see subscribers, views, monetization status, potential revenue, growth charts, and personalized recommendations.",
      keywords: ["YouTube channel analytics", "YouTube stats checker", "YouTube subscriber count", "YouTube revenue estimator", "channel analyzer"],
    },
    howToUse: [
      "Enter a YouTube @handle, channel name, or full channel URL.",
      "Click Analyze Channel to fetch public statistics.",
      "Review subscriber count, views, video count, monetization status, and potential ad revenue.",
      "Explore growth trend charts and recent video performance.",
      "Read personalized growth recommendations based on channel tier and engagement.",
    ],
    formula:
      "Stats from YouTube Data API v3 (channels.list, playlistItems, videos). Recommendations derived from subscriber tier, views-per-video ratio, and content library size.",
    faq: [
      { question: "Do I need to log in?", answer: "No. Enter any public YouTube channel handle or URL." },
      { question: "Why does it say API not configured?", answer: "The site admin must add a YouTube Data API key (YOUTUBE_API_KEY) in Vercel environment variables." },
      { question: "Can I analyze private channels?", answer: "No. Only public channel statistics are available via the YouTube API." },
      { question: "How often is data updated?", answer: "YouTube updates statistics periodically. Results are cached for up to 1 hour." },
      { question: "Can I see potential YouTube earnings?", answer: "Yes. The tool estimates monthly ad revenue ranges based on views and RPM, and shows 'Not monetized yet' if the channel has under 1,000 subscribers." },
    ],
  },
  {
    slug: "instagram-profile-insights",
    title: "Instagram Profile Analytics",
    shortDescription: "Check public Instagram stats, sponsorship revenue estimates, growth charts, and content tips.",
    category: "productivity",
    icon: "Instagram",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    badge: "Social Analytics",
    popular: true,
    seo: {
      title: "Instagram Profile Analytics — Free Instagram Stats & Revenue Estimator | Ranburg.com",
      description:
        "Free Instagram profile analyzer. See followers, posts, sponsorship revenue estimates, growth trend charts, and actionable content strategy recommendations.",
      keywords: ["Instagram analytics", "Instagram stats checker", "Instagram follower count", "Instagram revenue estimator", "profile analyzer"],
    },
    howToUse: [
      "Enter an Instagram @username or profile URL.",
      "Click Analyze Profile to fetch public profile statistics.",
      "Review followers, engagement estimates, and potential sponsorship revenue.",
      "Explore growth trend charts and tailored Reels and posting recommendations.",
    ],
    formula:
      "Public stats parsed from Instagram profile metadata. Revenue estimates based on creator tier, follower count, and typical sponsorship rates.",
    faq: [
      { question: "Does this work for private accounts?", answer: "No. Only public Instagram profiles with visible stats can be analyzed." },
      { question: "Why did analysis fail?", answer: "Instagram aggressively blocks datacenter IPs. We use browser-impersonated requests; if it still fails, wait a minute and retry. Private accounts are not supported." },
      { question: "Can I estimate Instagram earnings?", answer: "Yes. The tool shows sponsorship and affiliate revenue ranges based on follower tier and posting frequency." },
      { question: "How accurate are the stats?", answer: "Stats reflect publicly visible follower and post counts at the time of the request." },
      { question: "Do you store usernames?", answer: "No. Queries are processed on demand and not stored on our servers." },
    ],
  },
  {
    slug: "youtube-revenue-calculator",
    title: "YouTube Revenue Calculator",
    shortDescription: "Estimate YouTube ad revenue, sponsorship income, and monthly earnings from views and RPM.",
    category: "financial",
    icon: "Youtube",
    gradient: "from-red-600 to-red-500",
    badge: "Revenue Calculator",
    popular: true,
    seo: {
      title: "YouTube Revenue Calculator — Estimate Channel Earnings | Ranburg.com",
      description:
        "Free YouTube revenue calculator. Estimate monthly and annual ad revenue from views, RPM, sponsorship deals, and memberships with growth projections.",
      keywords: ["YouTube revenue calculator", "YouTube earnings estimator", "YouTube RPM calculator", "how much do YouTubers make"],
    },
    howToUse: [
      "Enter your estimated monthly views and RPM (revenue per 1,000 views).",
      "Add sponsorship deals per month and average deal value.",
      "Optionally include membership revenue and growth rate.",
      "View monthly, annual, and projected revenue charts.",
    ],
    formula: "Ad revenue = (monthly views ÷ 1,000) × RPM. Total = ad revenue + sponsorships + memberships.",
    faq: [
      { question: "What is YouTube RPM?", answer: "RPM (Revenue Per Mille) is estimated earnings per 1,000 views after YouTube's revenue share. Typical ranges: $1–$4 general, $4–$12 finance/tech." },
      { question: "Is this accurate?", answer: "Results are estimates. Actual YouTube earnings vary by niche, geography, ad seasonality, and audience demographics." },
      { question: "Does this include Shorts revenue?", answer: "Enter your total monthly views including Shorts. Shorts typically have lower RPM than long-form content." },
      { question: "Can I add brand deals?", answer: "Yes. Set sponsored posts per month and average deal value to include sponsorship income." },
      { question: "Is the calculator free?", answer: "Yes. No signup required." },
    ],
  },
  {
    slug: "instagram-revenue-calculator",
    title: "Instagram Revenue Calculator",
    shortDescription: "Estimate Instagram sponsorship income, affiliate revenue, and creator earnings by follower count.",
    category: "financial",
    icon: "Instagram",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    badge: "Revenue Calculator",
    popular: true,
    seo: {
      title: "Instagram Revenue Calculator — Estimate Creator Earnings | Ranburg.com",
      description:
        "Free Instagram revenue calculator. Estimate sponsorship income, affiliate earnings, and annual creator revenue based on followers and engagement rate.",
      keywords: ["Instagram revenue calculator", "Instagram earnings estimator", "influencer income calculator", "sponsorship rate calculator"],
    },
    howToUse: [
      "Enter follower count and engagement rate.",
      "Set sponsored posts per month and rate per post.",
      "Add affiliate or shop revenue and Reels bonus if applicable.",
      "Review suggested post rates and revenue projection chart.",
    ],
    formula: "Sponsorship revenue = posts × rate. Suggested rate ≈ (followers ÷ 1,000) × engagement × $2.50.",
    faq: [
      { question: "How do Instagram creators make money?", answer: "Primarily through brand sponsorships, affiliate marketing, product sales, and occasional Reels bonuses — not direct ad revenue." },
      { question: "What is a typical sponsorship rate?", answer: "Micro-influencers (10K–50K) often charge $100–$500 per post. Mid-tier (50K–500K) charge $500–$5,000+. Rates vary by niche and engagement." },
      { question: "What engagement rate should I use?", answer: "3–6% is typical for micro creators. Macro accounts often see 1–3%. Check Instagram Insights for your actual rate." },
      { question: "Is this guaranteed income?", answer: "No. These are industry-average estimates for planning purposes." },
      { question: "Is the calculator free?", answer: "Yes. No account required." },
    ],
  },
  {
    slug: "adsense-revenue-calculator",
    title: "Google AdSense Revenue Calculator",
    shortDescription: "Estimate Google AdSense earnings from page views, RPM, CTR, and traffic growth projections.",
    category: "financial",
    icon: "CircleDollarSign",
    gradient: "from-amber-500 to-orange-500",
    badge: "Revenue Calculator",
    popular: true,
    seo: {
      title: "Google AdSense Revenue Calculator — Estimate Website Earnings | Ranburg.com",
      description:
        "Free Google AdSense revenue calculator. Estimate monthly and annual ad earnings from page views, RPM, CTR, CPC, and compare revenue across content niches.",
      keywords: ["AdSense revenue calculator", "Google AdSense earnings estimator", "website RPM calculator", "blog income calculator"],
    },
    howToUse: [
      "Enter monthly page views and your estimated RPM.",
      "Optionally set CTR and CPC for click-based estimates.",
      "Adjust traffic growth rate for projections.",
      "Compare earnings across finance, tech, health, and entertainment niches.",
    ],
    formula: "AdSense revenue = (page views ÷ 1,000) × RPM. CPC revenue = page views × CTR × CPC.",
    faq: [
      { question: "What is a good AdSense RPM?", answer: "Finance and tech blogs: $8–$15 RPM. Health: $4–$8. General blogs: $2–$6. Entertainment: $1–$3." },
      { question: "How is AdSense RPM calculated?", answer: "RPM = (estimated earnings ÷ page views) × 1,000. It includes all ad formats and varies by geography and season." },
      { question: "Does this include YouTube AdSense?", answer: "This calculator is for website/blog AdSense. Use our YouTube Revenue Calculator for video earnings." },
      { question: "How accurate are projections?", answer: "Estimates assume steady RPM and growth. Actual AdSense earnings fluctuate with traffic quality and advertiser demand." },
      { question: "Is the calculator free?", answer: "Yes. No signup required." },
    ],
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    shortDescription: "Create professional GST invoices with line items, tax splits, and print-ready PDF output.",
    category: "financial",
    icon: "FileText",
    gradient: "from-sky-600 to-blue-500",
    badge: "Business",
    popular: true,
    seo: {
      title: "Free Invoice Generator — GST Invoice Maker Online | Ranburg.com",
      description:
        "Free online invoice generator with GST support, CGST/SGST/IGST splits, line items, and print-ready PDF. Create professional invoices in minutes — no signup.",
      keywords: ["invoice generator", "free invoice maker", "GST invoice generator", "online invoice template", "create invoice PDF"],
    },
    howToUse: [
      "Enter your business and client details including GSTIN if applicable.",
      "Add line items with quantity, rate, and GST rate per item.",
      "Choose CGST+SGST for intra-state or IGST for inter-state transactions.",
      "Preview the invoice and click Print / Save PDF to download or print.",
    ],
    formula: "Line total = qty × rate. GST = taxable × rate%. Grand total = subtotal + CGST/SGST or IGST.",
    faq: [
      { question: "Is this invoice legally valid?", answer: "This generates a professional invoice template. For GST compliance in India, ensure your GSTIN, HSN/SAC codes, and sequential invoice numbers meet your state's requirements." },
      { question: "Can I add GST?", answer: "Yes. Set GST rate per line item and choose intra-state (CGST+SGST) or inter-state (IGST) tax split." },
      { question: "Can I print or save as PDF?", answer: "Yes. Click Print / Save PDF to open a print dialog where you can save as PDF." },
      { question: "Is my data stored?", answer: "No. All invoice data stays in your browser and is not sent to our servers." },
      { question: "Is the invoice generator free?", answer: "Yes. No account or payment required." },
    ],
  },
  {
    slug: "loan-foreclosure-calculator",
    title: "Loan Foreclosure Calculator",
    shortDescription: "Calculate savings from early loan closure — full prepayment vs extra EMI per year, including bank foreclosure charges.",
    category: "financial",
    icon: "Calculator",
    gradient: "from-teal-600 to-cyan-500",
    badge: "Loan Calculator",
    popular: true,
    seo: {
      title: "Loan Foreclosure Calculator — Early Closure Savings | Ranburg.com",
      description:
        "Free loan foreclosure calculator. Compare full prepayment vs extra annual EMI payments. Includes bank foreclosure charges and net interest savings.",
      keywords: ["loan foreclosure calculator", "early loan closure", "prepayment calculator", "home loan foreclosure charges", "loan prepayment benefit"],
    },
    howToUse: [
      "Enter loan amount, interest rate, original tenure, and EMIs already paid.",
      "Choose strategy: full prepayment, extra payment per year, or continue as-is.",
      "Set foreclosure charges as a percentage or flat fee for full prepayment.",
      "Review interest saved, net benefit after charges, and remaining interest.",
    ],
    formula: "EMI = P × r × (1+r)^n / ((1+r)^n − 1). Net benefit = remaining interest saved − foreclosure charges.",
    faq: [
      { question: "What are foreclosure charges?", answer: "Banks may charge 0–5% of outstanding principal or a flat fee when you close a loan early. Enter your bank's rate for accurate comparison." },
      { question: "Is prepaying always beneficial?", answer: "Not always. If foreclosure charges exceed interest savings, continuing or making partial prepayments may be better." },
      { question: "What is extra EMI per year?", answer: "An alternative to full closure — pay an additional lump sum each year to reduce principal without triggering full foreclosure penalties." },
      { question: "Does this work for home loans?", answer: "Yes. Enter your home loan parameters. Floating-rate loans may have different foreclosure rules than fixed-rate loans." },
      { question: "Is the calculator free?", answer: "Yes. No signup required." },
    ],
  },
  ...SALESFORCE_TOOLS,
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS_CONFIG.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategoryId): ToolConfig[] {
  return TOOLS_CONFIG.filter((t) => t.category === category);
}

export function getCategoryById(id: ToolCategoryId): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((c) => c.id === id);
}
