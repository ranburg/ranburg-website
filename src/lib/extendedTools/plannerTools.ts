import { makeTool } from "./makeTool";
import type { ToolConfig } from "../toolsConfig";

const freeFaq = {
  question: "Is this tool free to use?",
  answer: "Yes. It is free, needs no account, and runs in your browser.",
};
const privacyFaq = {
  question: "Is my data stored or uploaded?",
  answer: "No. Everything is calculated in your browser and nothing you enter is sent to Ranburg.",
};
const adviceFaq = {
  question: "Is this financial advice?",
  answer:
    "No. Results are estimates based on the assumptions you enter, such as a constant rate of return. Confirm important decisions with a qualified adviser.",
};

/** Planning, design, developer and focus tools added in the late-2026 wave. */
export const PLANNER_TOOLS: ToolConfig[] = [
  makeTool({
    slug: "step-up-sip-calculator",
    title: "Step-Up SIP Calculator",
    shortDescription: "See how raising your SIP every year changes the final corpus, compared with a flat SIP.",
    category: "financial",
    icon: "TrendingUp",
    gradient: "from-emerald-500 to-teal-600",
    badge: "Investing",
    popular: true,
    keywords: ["step up sip calculator", "top up sip calculator", "sip with annual increase", "step up sip returns", "sip step up calculator india"],
    howToUse: [
      "Enter the monthly SIP you will start with.",
      "Set the yearly step-up percentage, the expected annual return and the number of years.",
      "Read the stepped corpus, the total invested and the extra amount earned over a flat SIP.",
      "Use the chart to see where the step-up and flat SIP lines separate.",
    ],
    formula:
      "Each month: corpus = (corpus + SIP) × (1 + r/12). The SIP is multiplied by (1 + step-up %) at the start of every new year.",
    faq: [
      {
        question: "What is a step-up SIP?",
        answer:
          "A SIP where the monthly amount increases on a schedule, usually once a year by a fixed percentage, so contributions grow along with your income.",
      },
      {
        question: "How much difference does a step-up make?",
        answer:
          "Over long periods it is large. A ₹10,000 SIP at 12% for 20 years grows to about ₹99.9 lakh flat, and about ₹1.99 crore with a 10% yearly step-up.",
      },
      {
        question: "Which step-up percentage should I use?",
        answer: "One you can sustain in a weak year. Many investors use 5–10%, close to their typical salary increment.",
      },
      adviceFaq,
    ],
    seoDescription:
      "Free step-up SIP calculator online. See how a yearly increase in your SIP changes the corpus versus a flat SIP, with a year-by-year chart. No signup.",
  }),
  makeTool({
    slug: "lumpsum-calculator",
    title: "Lumpsum Calculator",
    shortDescription: "Project the future value of a one-time investment and see what it is worth after inflation.",
    category: "financial",
    icon: "Coins",
    gradient: "from-cyan-500 to-blue-600",
    badge: "Investing",
    keywords: ["lumpsum calculator", "lump sum investment calculator", "mutual fund lumpsum calculator", "one time investment calculator", "lumpsum returns"],
    howToUse: [
      "Enter the amount you plan to invest once.",
      "Set the expected annual return and the holding period in years.",
      "Adjust the inflation rate to see the corpus in today's money.",
      "Review the growth chart and the wealth gained.",
    ],
    formula: "Future value = P × (1 + r)^n. Inflation-adjusted value = future value ÷ (1 + inflation)^n.",
    faq: [
      {
        question: "How is lumpsum growth calculated?",
        answer: "With annual compounding: the amount invested is multiplied by (1 + annual return) once for every year it is held.",
      },
      {
        question: "What does the inflation-adjusted value mean?",
        answer:
          "It is the future corpus expressed in today's purchasing power. A large future number can buy much less than it appears once prices have risen.",
      },
      {
        question: "Is lumpsum better than SIP?",
        answer:
          "Neither is always better. A lumpsum puts all the money to work at once; a SIP spreads purchases over time and suits regular income. Compare both with the SIP calculator.",
      },
      adviceFaq,
    ],
    seoDescription:
      "Free lumpsum calculator online. Project the future value of a one-time mutual fund investment and its inflation-adjusted worth, with a growth chart.",
  }),
  makeTool({
    slug: "goal-sip-calculator",
    title: "Goal SIP Calculator",
    shortDescription: "Work backwards from a target amount to the monthly SIP or one-time investment you need.",
    category: "financial",
    icon: "Award",
    gradient: "from-violet-500 to-indigo-600",
    badge: "Planning",
    keywords: ["goal sip calculator", "sip goal planner", "how much sip for 1 crore", "target sip calculator", "goal based investment calculator"],
    howToUse: [
      "Enter the amount you want to reach and the years you have.",
      "Set the expected annual return and any amount you have already saved for this goal.",
      "Read the monthly SIP required, or the one-time investment that would do the same job.",
      "Switch to today's prices to inflate the goal to its future cost automatically.",
    ],
    formula:
      "Monthly SIP = (Target − existing × (1 + i)^n) ÷ [((1 + i)^n − 1) ÷ i × (1 + i)], where i is the monthly return and n the number of months.",
    faq: [
      {
        question: "How much SIP do I need for ₹1 crore?",
        answer:
          "It depends on time and return. At 12% a year over 15 years it is roughly ₹19,800 a month. Enter your own horizon and return for an exact figure.",
      },
      {
        question: "Should I adjust my goal for inflation?",
        answer:
          "Yes for long-term goals. Something that costs ₹50 lakh today will cost considerably more in ten or fifteen years, so the calculator can inflate the target for you.",
      },
      {
        question: "What if I already have savings for the goal?",
        answer: "Enter them as existing savings. Their projected growth is subtracted from the target before the SIP is calculated.",
      },
      adviceFaq,
    ],
    seoDescription:
      "Free goal SIP calculator online. Find the monthly SIP or lumpsum needed to reach a target amount, with inflation and existing savings included.",
  }),
  makeTool({
    slug: "xirr-calculator",
    title: "XIRR Calculator",
    shortDescription: "Find the annualised return for investments and withdrawals made on different dates.",
    category: "financial",
    icon: "BarChart3",
    gradient: "from-indigo-500 to-violet-600",
    badge: "Investing",
    popular: true,
    keywords: ["xirr calculator", "xirr calculator online", "sip xirr calculator", "mutual fund xirr", "irregular cash flow return"],
    howToUse: [
      "Add a row for every investment with its date and amount, marked as Invested.",
      "Add redemptions, dividends or today's value of the holding as Received rows.",
      "Read the XIRR as an annual percentage, alongside the absolute return.",
      "Add or remove rows to test different scenarios.",
    ],
    formula: "XIRR is the rate r that solves Σ cash flow ÷ (1 + r)^(days since first flow ÷ 365) = 0.",
    faq: [
      {
        question: "What is XIRR?",
        answer:
          "XIRR is the annualised rate of return for a series of cash flows on different dates. It accounts for when each amount was invested or received.",
      },
      {
        question: "How is XIRR different from CAGR?",
        answer:
          "CAGR assumes one investment at the start and one value at the end. XIRR handles many cash flows on different dates, which makes it the right measure for SIPs.",
      },
      {
        question: "How do I enter an investment I still hold?",
        answer: "Add its current market value as a Received row dated today, as if you sold it now.",
      },
      {
        question: "Why is no result shown?",
        answer: "XIRR needs at least one Invested row and one Received row on different dates. With only one kind of cash flow there is no rate to solve for.",
      },
    ],
    seoDescription:
      "Free XIRR calculator online. Enter dated investments and withdrawals to get the annualised return for SIPs and irregular cash flows. No signup.",
  }),
  makeTool({
    slug: "stock-average-calculator",
    title: "Stock Average Calculator",
    shortDescription: "Calculate your average share price across purchases and plan how many shares lower it to a target.",
    category: "financial",
    icon: "Scale",
    gradient: "from-sky-500 to-blue-600",
    badge: "Stocks",
    keywords: ["stock average calculator", "share average calculator", "average down calculator", "stock average price calculator", "averaging calculator"],
    howToUse: [
      "Enter the quantity and price of each purchase.",
      "Read your average price, total shares and total cost.",
      "Enter the current market price and the average you would like to reach.",
      "See how many shares to buy, and how much cash that needs.",
    ],
    formula:
      "Average price = total cost ÷ total shares. Shares to buy = current shares × (current average − target average) ÷ (target average − market price).",
    faq: [
      {
        question: "How is the average stock price calculated?",
        answer: "Total money spent across all purchases divided by the total number of shares, so larger purchases carry more weight.",
      },
      {
        question: "Why does it say the target is not reachable?",
        answer:
          "Buying at the market price can only move your average toward that price. The target has to lie between the market price and your current average.",
      },
      {
        question: "Does it work for any market or currency?",
        answer: "Yes. It is plain arithmetic on quantity and price, so it works for shares, ETFs, crypto or mutual fund units in any currency.",
      },
      {
        question: "Does it include brokerage and taxes?",
        answer: "No. Add charges to your purchase price if you want them reflected in the average.",
      },
    ],
    seoDescription:
      "Free stock average calculator online. Find your average share price across purchases and how many shares you need to average down to a target.",
  }),
  makeTool({
    slug: "fire-calculator",
    title: "FIRE Calculator",
    shortDescription: "Estimate your FIRE number and how many years until your investments can cover your expenses.",
    category: "financial",
    icon: "Flame",
    gradient: "from-orange-500 to-rose-600",
    badge: "Retirement",
    popular: true,
    keywords: ["fire calculator", "fire calculator india", "financial independence calculator", "retire early calculator", "fire number calculator"],
    howToUse: [
      "Enter your current age, monthly expenses and existing investments.",
      "Set how much you invest each month and how much that rises every year.",
      "Choose the expected return, inflation and withdrawal rate.",
      "Read your FIRE number, the years to reach it and the chart of corpus against target.",
    ],
    formula:
      "FIRE number = annual expenses ÷ withdrawal rate. The target grows with inflation each year; FIRE is reached when the projected corpus meets it.",
    faq: [
      {
        question: "What is a FIRE number?",
        answer:
          "The corpus at which a chosen withdrawal rate covers your yearly expenses. At a 4% withdrawal rate it is 25 times your annual spending.",
      },
      {
        question: "Which withdrawal rate should I use?",
        answer:
          "4% is a common starting assumption drawn from historical US data. Many planners use 3–3.5% for long or early retirements to leave a wider margin.",
      },
      {
        question: "Why does the target keep rising on the chart?",
        answer: "Your expenses grow with inflation, so the corpus needed to fund them grows every year too.",
      },
      adviceFaq,
    ],
    seoDescription:
      "Free FIRE calculator online. Estimate your FIRE number and years to financial independence from expenses, savings, returns and inflation.",
  }),
  makeTool({
    slug: "home-loan-eligibility-calculator",
    title: "Home Loan Eligibility Calculator",
    shortDescription: "Estimate the home loan and property budget your income can support, after existing EMIs.",
    category: "financial",
    icon: "Home",
    gradient: "from-teal-500 to-emerald-600",
    badge: "Loans",
    keywords: ["home loan eligibility calculator", "how much home loan can i get", "home loan eligibility on salary", "housing loan eligibility", "loan eligibility calculator"],
    howToUse: [
      "Enter your net monthly income and the EMIs you already pay.",
      "Set the share of income a lender will allow towards EMIs.",
      "Choose the interest rate, tenure and down payment percentage.",
      "Read the maximum EMI, the eligible loan amount and the property budget.",
    ],
    formula:
      "Max EMI = income × allowed share − existing EMIs. Loan = EMI × ((1 + r)^n − 1) ÷ (r × (1 + r)^n), with r the monthly rate and n the months.",
    faq: [
      {
        question: "How do lenders decide home loan eligibility?",
        answer:
          "They cap total EMIs at a share of your net income, subtract what you already pay, and work out the loan the remaining EMI can repay at the offered rate and tenure.",
      },
      {
        question: "What share of income should I enter?",
        answer:
          "It is each lender's own policy and varies with income and profile. Around 40–50% of net income is a common working assumption for an estimate.",
      },
      {
        question: "How can I increase my eligibility?",
        answer: "Close existing loans, add a co-applicant with income, choose a longer tenure, or improve your credit profile to qualify for a lower rate.",
      },
      {
        question: "Is this a loan offer?",
        answer: "No. It is an estimate. Lenders apply their own checks on credit score, age, employer and the property before sanctioning a loan.",
      },
    ],
    seoDescription:
      "Free home loan eligibility calculator online. Estimate the loan amount and property budget your salary supports after existing EMIs. No signup.",
  }),
  makeTool({
    slug: "css-gradient-generator",
    title: "CSS Gradient Generator",
    shortDescription: "Build linear, radial and conic CSS gradients with live preview and copy-ready code.",
    category: "design",
    icon: "Palette",
    gradient: "from-fuchsia-500 to-violet-600",
    badge: "CSS",
    popular: true,
    keywords: ["css gradient generator", "linear gradient generator", "radial gradient css", "conic gradient generator", "gradient background css"],
    howToUse: [
      "Choose linear, radial or conic.",
      "Pick colours and set the position of each stop; add up to six stops.",
      "Set the angle for linear and conic gradients.",
      "Copy the CSS and paste it into your stylesheet.",
    ],
    formula: "background: linear-gradient(angle, colour stop%, …) | radial-gradient(circle at center, …) | conic-gradient(from angle at center, …)",
    faq: [
      {
        question: "What is the difference between linear, radial and conic gradients?",
        answer:
          "Linear blends along a line at an angle, radial blends outward from a point, and conic sweeps colours around a centre like a colour wheel.",
      },
      {
        question: "Do CSS gradients work in every browser?",
        answer: "Linear and radial gradients work in all current browsers. Conic gradients are supported in all modern evergreen browsers.",
      },
      {
        question: "How do I make a gradient look smooth?",
        answer: "Use hues that sit close together, or add a midpoint stop so the blend does not pass through a dull grey.",
      },
      freeFaq,
    ],
    seoDescription:
      "Free CSS gradient generator online. Create linear, radial and conic gradients with multiple colour stops, live preview and copy-ready CSS.",
  }),
  makeTool({
    slug: "box-shadow-generator",
    title: "Box Shadow Generator",
    shortDescription: "Design layered CSS box shadows with offset, blur, spread, opacity and inset controls.",
    category: "design",
    icon: "Layers",
    gradient: "from-slate-500 to-indigo-600",
    badge: "CSS",
    keywords: ["box shadow generator", "css box shadow generator", "layered box shadow", "box shadow css", "inset shadow generator"],
    howToUse: [
      "Adjust the horizontal and vertical offset, blur and spread.",
      "Set the shadow colour and opacity, or switch on inset.",
      "Add more layers for a softer, more realistic shadow.",
      "Copy the box-shadow CSS.",
    ],
    formula: "box-shadow: [inset] offset-x offset-y blur-radius spread-radius colour, …",
    faq: [
      {
        question: "What do the box-shadow values mean?",
        answer: "In order: horizontal offset, vertical offset, blur radius, spread radius and colour. The optional inset keyword draws the shadow inside the element.",
      },
      {
        question: "Why use more than one shadow layer?",
        answer: "Real objects cast a tight dark shadow and a wide soft one. Stacking two or three low-opacity layers looks far more natural than a single shadow.",
      },
      {
        question: "What does a negative spread do?",
        answer: "It shrinks the shadow before blurring, so it tucks in under the element and shows mostly at the bottom.",
      },
      freeFaq,
    ],
    seoDescription:
      "Free CSS box shadow generator online. Build layered and inset shadows with offset, blur, spread and opacity controls, then copy the CSS.",
  }),
  makeTool({
    slug: "color-palette-generator",
    title: "Color Palette Generator",
    shortDescription: "Generate colour harmonies and a full tint and shade scale from a single base colour.",
    category: "design",
    icon: "Palette",
    gradient: "from-pink-500 to-orange-500",
    badge: "Colour",
    popular: true,
    keywords: ["color palette generator", "colour palette generator", "color scheme generator", "tailwind color palette generator", "complementary color generator"],
    howToUse: [
      "Pick a base colour or generate a random one.",
      "Choose a harmony: analogous, complementary, triadic and more.",
      "Click any swatch to copy its HEX code.",
      "Copy the full scale as CSS variables or Tailwind colours.",
    ],
    formula: "Harmonies rotate hue on the HSL wheel (for example +180° for complementary); the 50–900 scale varies lightness at the same hue.",
    faq: [
      {
        question: "What are colour harmonies?",
        answer: "Colour combinations built from fixed positions on the colour wheel — neighbours (analogous), opposites (complementary) or evenly spaced hues (triadic).",
      },
      {
        question: "What is the 50–900 scale for?",
        answer: "It gives light, mid and dark versions of one hue for backgrounds, borders and text, the convention used by Tailwind and many design systems.",
      },
      {
        question: "Can I use the palette in Tailwind CSS?",
        answer: "Yes. Copy the Tailwind colours block into the colors section of your theme configuration.",
      },
      freeFaq,
    ],
    seoDescription:
      "Free colour palette generator online. Create harmonies and a 50–900 tint and shade scale from one colour, with CSS variable and Tailwind output.",
  }),
  makeTool({
    slug: "json-to-typescript",
    title: "JSON to TypeScript Converter",
    shortDescription: "Turn a JSON sample into clean TypeScript interfaces, with optional fields detected for you.",
    category: "developer",
    icon: "Braces",
    gradient: "from-blue-500 to-indigo-600",
    badge: "TypeScript",
    popular: true,
    keywords: ["json to typescript", "json to typescript interface", "json to ts", "generate typescript types from json", "json to interface online"],
    howToUse: [
      "Paste a JSON object or array.",
      "Set the name of the root type.",
      "Review the generated interfaces — nested objects get their own named types.",
      "Copy the TypeScript into your project.",
    ],
    formula: "Objects → interfaces, arrays → element type[], mixed arrays → union types, keys missing from some array items → optional (?).",
    faq: [
      {
        question: "How are optional properties detected?",
        answer: "Objects inside an array are merged into one shape. A key that is missing from some of the items is marked optional with a question mark.",
      },
      {
        question: "Why is a property typed as null?",
        answer: "Its value was null in the sample, so no other type could be inferred. Widen it by hand, for example to string | null.",
      },
      {
        question: "Does it generate interfaces or type aliases?",
        answer: "Interfaces for objects, and a type alias when the root of the JSON is an array or a primitive value.",
      },
      privacyFaq,
    ],
    seoDescription:
      "Free JSON to TypeScript converter online. Paste JSON and get clean interfaces with nested types and optional fields. Runs in your browser.",
  }),
  makeTool({
    slug: "number-base-converter",
    title: "Number Base Converter",
    shortDescription: "Convert whole numbers between binary, octal, decimal, hexadecimal and any base from 2 to 36.",
    category: "developer",
    icon: "Binary",
    gradient: "from-emerald-500 to-cyan-600",
    badge: "Converter",
    keywords: ["number base converter", "binary to decimal converter", "hex to decimal converter", "decimal to binary", "base converter online"],
    howToUse: [
      "Type a number and choose the base it is written in.",
      "Read the binary, octal, decimal and hexadecimal values.",
      "Use the slider for any other base up to 36.",
      "Copy the result you need.",
    ],
    formula: "Value = Σ digit × base^position. The value is then rewritten using digits of the target base (0–9, then a–z).",
    faq: [
      {
        question: "How do I convert binary to decimal?",
        answer: "Multiply each binary digit by 2 raised to its position, counting from zero on the right, and add the results. 1010 is 8 + 2 = 10.",
      },
      {
        question: "Is there a limit on the size of the number?",
        answer: "No practical limit. Conversion uses arbitrary-precision integers, so very long numbers stay exact.",
      },
      {
        question: "Can I type prefixes like 0x or 0b?",
        answer: "Yes. 0x, 0b and 0o are accepted when they match the selected input base, and spaces or underscores are ignored.",
      },
      {
        question: "Does it handle fractions?",
        answer: "No. It converts whole numbers, including negative ones.",
      },
    ],
    seoDescription:
      "Free number base converter online. Convert between binary, octal, decimal, hex and any base from 2 to 36 with arbitrary precision. No signup.",
  }),
  makeTool({
    slug: "pomodoro-timer",
    title: "Pomodoro Timer",
    shortDescription: "A focus timer with adjustable work and break lengths, auto-start and a session counter.",
    category: "productivity",
    icon: "Timer",
    gradient: "from-rose-500 to-orange-500",
    badge: "Focus",
    popular: true,
    keywords: ["pomodoro timer", "pomodoro timer online", "25 minute timer", "focus timer", "study timer"],
    howToUse: [
      "Decide on one task, then press Start.",
      "Work until the timer ends, then take the short break.",
      "After four focus sessions, take the long break.",
      "Adjust the lengths, auto-start and chime in the settings.",
    ],
    formula: "Classic cycle: 25 minutes of focus, 5 minutes of rest, and a 15–30 minute break after every fourth focus session.",
    faq: [
      {
        question: "What is the Pomodoro Technique?",
        answer: "A time-management method: work on one task for 25 minutes, rest for 5, and take a longer break after four rounds.",
      },
      {
        question: "Can I change the 25-minute length?",
        answer: "Yes. Focus, short break and long break lengths are all adjustable, as is the number of sessions before a long break.",
      },
      {
        question: "Does the timer keep running in a background tab?",
        answer: "Yes. It follows the clock rather than counting ticks, and the remaining time shows in the tab title.",
      },
      {
        question: "Is my session count saved?",
        answer: "It is kept while the page is open and resets when you close or reload the tab.",
      },
    ],
    seoDescription:
      "Free Pomodoro timer online. Adjustable focus and break lengths, auto-start, chime and session counter, with the countdown in your tab title.",
  }),
  makeTool({
    slug: "typing-speed-test",
    title: "Typing Speed Test",
    shortDescription: "Measure your typing speed in WPM with live accuracy, mistake highlighting and a personal best.",
    category: "productivity",
    icon: "Gauge",
    gradient: "from-amber-500 to-orange-600",
    badge: "Skills",
    popular: true,
    keywords: ["typing speed test", "wpm test", "typing test online", "words per minute test", "typing test 1 minute"],
    howToUse: [
      "Choose a test length: 15, 30, 60 or 120 seconds.",
      "Click the passage and start typing — the timer starts with your first key.",
      "Watch net WPM and accuracy update as you type.",
      "Review your result and try again to beat your personal best.",
    ],
    formula: "Gross WPM = (characters typed ÷ 5) ÷ minutes. Net WPM = (correct characters ÷ 5) ÷ minutes. Accuracy = correct ÷ typed × 100.",
    faq: [
      {
        question: "How is WPM calculated?",
        answer: "A word is counted as five characters, including spaces. Net WPM uses only the characters you typed correctly.",
      },
      {
        question: "What is a good typing speed?",
        answer: "There is no official standard. Roughly 40 WPM is typical for casual typists, and 50–60 WPM with high accuracy is comfortable for office work.",
      },
      {
        question: "Can I correct mistakes?",
        answer: "Yes. Backspace works, and corrected characters are not counted as mistakes. Pasting is disabled.",
      },
      {
        question: "Where is my personal best saved?",
        answer: "In your browser's local storage on this device. Nothing you type is uploaded.",
      },
    ],
    seoDescription:
      "Free typing speed test online. Check your WPM and accuracy in 15, 30, 60 or 120 seconds with live mistake highlighting. No signup needed.",
  }),
  makeTool({
    slug: "time-zone-converter",
    title: "Time Zone Converter",
    shortDescription: "Convert a date and time between cities, with UTC offsets, daylight saving and day changes shown.",
    category: "productivity",
    icon: "Globe",
    gradient: "from-sky-500 to-indigo-600",
    badge: "Scheduling",
    popular: true,
    keywords: ["time zone converter", "timezone converter", "ist to est", "meeting time converter", "world clock converter"],
    howToUse: [
      "Pick the date and time, and the city it applies to.",
      "Read the matching time in every city in your list.",
      "Add or remove cities to suit your team.",
      "Copy the times to paste into an invitation or message.",
    ],
    formula: "Target time = source time − source UTC offset + target UTC offset, using each zone's offset on the chosen date.",
    faq: [
      {
        question: "Does it handle daylight saving time?",
        answer: "Yes. Offsets are taken from your browser's time zone database for the date you pick, so daylight saving is applied where it is observed.",
      },
      {
        question: "Why does a city show the next or previous day?",
        answer: "A large enough offset moves the time past midnight. The converter flags those cities so you can state the correct date.",
      },
      {
        question: "What time is it in India compared with New York?",
        answer: "India is 9 hours 30 minutes ahead of New York during US daylight time and 10 hours 30 minutes ahead during standard time.",
      },
      freeFaq,
    ],
    seoDescription:
      "Free time zone converter online. Convert a meeting time between cities with UTC offsets, daylight saving and next-day markers. No signup.",
  }),
  makeTool({
    slug: "cgpa-to-percentage-calculator",
    title: "CGPA to Percentage Calculator",
    shortDescription: "Convert CGPA to percentage and back using the common 10-point, 5-point and 4-point formulas.",
    category: "productivity",
    icon: "Percent",
    gradient: "from-violet-500 to-fuchsia-600",
    badge: "Education",
    keywords: ["cgpa to percentage calculator", "cgpa to percentage", "percentage to cgpa", "cgpa calculator", "convert cgpa to percentage"],
    howToUse: [
      "Choose CGPA to percentage, or percentage to CGPA.",
      "Select the formula your board or university uses.",
      "Enter your CGPA or percentage.",
      "Read the converted value and the quick reference table.",
    ],
    formula: "Common rules: Percentage = CGPA × 9.5; Percentage = (CGPA − 0.75) × 10; or Percentage = CGPA ÷ scale × 100.",
    faq: [
      {
        question: "How do I convert CGPA to percentage?",
        answer: "On a 10-point scale the most common rule is CGPA × 9.5, so a CGPA of 8.4 is 79.8%. Some universities use a different formula.",
      },
      {
        question: "Which formula should I use?",
        answer: "The one stated on your transcript or in your institution's regulations. If none is published, ask the examination office before using a figure on an application.",
      },
      {
        question: "Can I convert a 4-point GPA?",
        answer: "Yes. Choose the proportional formula and the 4-point scale. Note that many universities use their own tables for 4-point GPAs.",
      },
      {
        question: "Can I convert percentage back to CGPA?",
        answer: "Yes. Switch the direction and the same formula is applied in reverse.",
      },
    ],
    seoDescription:
      "Free CGPA to percentage calculator online. Convert CGPA to percentage or back with the 9.5 multiplier and other common formulas. No signup.",
  }),
];
