"use client";

import { useEffect, useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip } from "@/components/tools/viz";
import {
  aspectRatio,
  bmiCategory,
  bmiMetric,
  buildUtmUrl,
  cagr,
  changePercent,
  fdMaturity,
  fleschReadingEase,
  hexToRgb,
  hoursBetween,
  htmlEscape,
  htmlUnescape,
  numberToIndianWords,
  percentOf,
  rgbToHex,
  simpleInterest,
  uniqueLines,
  vatFromGross,
  vatFromNet,
  whatPercent,
  workingDays,
  discountPrice,
  rdMaturity,
  inflateAmount,
  mifflinBmr,
  tdee,
  calendarDays,
  toRoman,
  fromRoman,
  textToBinary,
  binaryToText,
  mean,
  tipSplit,
  pxToRem,
  passwordStrength,
  waterLiters,
} from "@/lib/demandMath";

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function PercentageCalculatorTool() {
  const [pct, setPct] = useState(18);
  const [base, setBase] = useState(25000);
  const [part, setPart] = useState(4500);
  const [whole, setWhole] = useState(18000);
  const of = percentOf(pct, base);
  const asPct = whatPercent(part, whole);
  return (
    <Shell>
      <CalculatorSlider label="Percent (X%)" value={pct} min={0} max={200} step={0.1} unit="%" onChange={setPct} />
      <CalculatorSlider label="Of this number (Y)" value={base} min={0} max={10_000_000} step={100} onChange={setBase} />
      <KPIStrip items={[{ label: `${pct}% of ${base.toLocaleString("en-IN")}`, value: of.toLocaleString("en-IN", { maximumFractionDigits: 2 }), highlight: true }]} />
      <CalculatorSlider label="Part" value={part} min={0} max={10_000_000} step={50} onChange={setPart} />
      <CalculatorSlider label="Whole" value={whole} min={0} max={10_000_000} step={50} onChange={setWhole} />
      <KPIStrip items={[{ label: "Part is this % of whole", value: asPct === null ? "—" : `${asPct.toFixed(2)}%` }]} />
    </Shell>
  );
}

export function PercentageChangeTool() {
  const [from, setFrom] = useState(1000);
  const [to, setTo] = useState(1250);
  const change = changePercent(from, to);
  return (
    <Shell>
      <CalculatorSlider label="Original value" value={from} min={-1_000_000} max={10_000_000} step={10} onChange={setFrom} />
      <CalculatorSlider label="New value" value={to} min={-1_000_000} max={10_000_000} step={10} onChange={setTo} />
      <KPIStrip
        items={[
          {
            label: change === null ? "Change" : change >= 0 ? "Increase" : "Decrease",
            value: change === null ? "—" : `${Math.abs(change).toFixed(2)}%`,
            highlight: true,
          },
        ]}
      />
    </Shell>
  );
}

export function BmiCalculatorTool() {
  const [kg, setKg] = useState(70);
  const [cm, setCm] = useState(170);
  const bmi = bmiMetric(kg, cm);
  return (
    <Shell>
      <CalculatorSlider label="Weight" value={kg} min={20} max={250} step={0.5} unit=" kg" onChange={setKg} />
      <CalculatorSlider label="Height" value={cm} min={100} max={230} step={0.5} unit=" cm" onChange={setCm} />
      <KPIStrip
        items={[
          { label: "BMI", value: bmi === null ? "—" : bmi.toFixed(1), highlight: true },
          { label: "Category", value: bmi === null ? "—" : bmiCategory(bmi) },
        ]}
      />
      <p className="text-sm text-theme-muted">Screening only — not medical advice.</p>
    </Shell>
  );
}

export function CagrCalculatorTool() {
  const [start, setStart] = useState(100000);
  const [end, setEnd] = useState(180000);
  const [years, setYears] = useState(5);
  const rate = cagr(start, end, years);
  return (
    <Shell>
      <CalculatorSlider label="Starting value" value={start} min={1} max={50_000_000} step={1000} prefix="₹" onChange={setStart} />
      <CalculatorSlider label="Ending value" value={end} min={1} max={50_000_000} step={1000} prefix="₹" onChange={setEnd} />
      <CalculatorSlider label="Years" value={years} min={0.5} max={40} step={0.5} unit=" yrs" onChange={setYears} />
      <KPIStrip items={[{ label: "CAGR", value: rate === null ? "—" : `${(rate * 100).toFixed(2)}%`, highlight: true }]} />
    </Shell>
  );
}

export function FdCalculatorTool() {
  const [p, setP] = useState(100000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(5);
  const [n, setN] = useState(4);
  const maturity = fdMaturity(p, rate, years, n);
  return (
    <Shell>
      <CalculatorSlider label="Principal" value={p} min={1000} max={20_000_000} step={1000} prefix="₹" onChange={setP} />
      <CalculatorSlider label="Interest rate" value={rate} min={1} max={12} step={0.05} unit="%" onChange={setRate} />
      <CalculatorSlider label="Tenure" value={years} min={0.25} max={10} step={0.25} unit=" yrs" onChange={setYears} />
      <CalculatorSlider label="Compounds per year" value={n} min={1} max={12} step={1} onChange={setN} />
      <KPIStrip
        items={[
          { label: "Maturity", value: inr(maturity), highlight: true },
          { label: "Interest", value: inr(maturity - p) },
        ]}
      />
    </Shell>
  );
}

export function SimpleInterestTool() {
  const [p, setP] = useState(50000);
  const [r, setR] = useState(8);
  const [t, setT] = useState(3);
  const si = simpleInterest(p, r, t);
  return (
    <Shell>
      <CalculatorSlider label="Principal" value={p} min={0} max={10_000_000} step={500} prefix="₹" onChange={setP} />
      <CalculatorSlider label="Rate" value={r} min={0} max={36} step={0.1} unit="%" onChange={setR} />
      <CalculatorSlider label="Time" value={t} min={0.1} max={30} step={0.1} unit=" yrs" onChange={setT} />
      <KPIStrip
        items={[
          { label: "Simple interest", value: inr(si), highlight: true },
          { label: "Total", value: inr(p + si) },
        ]}
      />
    </Shell>
  );
}

export function VatCalculatorTool() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(20);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const added = vatFromNet(amount, rate);
  const removed = vatFromGross(amount, rate);
  return (
    <Shell>
      <div className="flex gap-2">
        {(["add", "remove"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === m ? "bg-accent text-white" : "bg-theme-surface text-theme-muted"}`}
          >
            {m === "add" ? "Add VAT" : "Remove VAT"}
          </button>
        ))}
      </div>
      <CalculatorSlider label="Amount" value={amount} min={0} max={10_000_000} step={1} onChange={setAmount} />
      <CalculatorSlider label="VAT rate" value={rate} min={0} max={40} step={0.5} unit="%" onChange={setRate} />
      {mode === "add" ? (
        <KPIStrip items={[{ label: "VAT", value: added.vat.toFixed(2) }, { label: "Gross", value: added.gross.toFixed(2), highlight: true }]} />
      ) : (
        <KPIStrip items={[{ label: "Net", value: removed.net.toFixed(2), highlight: true }, { label: "VAT", value: removed.vat.toFixed(2) }]} />
      )}
    </Shell>
  );
}

export function UnixTimestampTool() {
  const [epoch, setEpoch] = useState(() => Math.floor(Date.now() / 1000).toString());
  const n = Number(epoch);
  const valid = Number.isFinite(n);
  const date = valid ? new Date(n * 1000) : null;
  return (
    <Shell>
      <label className="block text-sm font-medium text-theme-body">
        Unix timestamp (seconds)
        <input className="input-field mt-2" value={epoch} onChange={(e) => setEpoch(e.target.value)} inputMode="numeric" />
      </label>
      <KPIStrip
        items={[
          { label: "UTC", value: date && !Number.isNaN(date.getTime()) ? date.toISOString() : "Invalid", highlight: true },
          { label: "Local", value: date && !Number.isNaN(date.getTime()) ? date.toString() : "—" },
        ]}
      />
      <button
        type="button"
        className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))}
      >
        Use now
      </button>
    </Shell>
  );
}

export function UtmBuilderTool() {
  const [base, setBase] = useState("https://www.ranburg.com/tools");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("spring");
  const url = buildUtmUrl(base, source, medium, campaign);
  return (
    <Shell>
      <label className="block text-sm font-medium">Landing page URL<input className="input-field mt-2" value={base} onChange={(e) => setBase(e.target.value)} /></label>
      <label className="block text-sm font-medium">utm_source<input className="input-field mt-2" value={source} onChange={(e) => setSource(e.target.value)} /></label>
      <label className="block text-sm font-medium">utm_medium<input className="input-field mt-2" value={medium} onChange={(e) => setMedium(e.target.value)} /></label>
      <label className="block text-sm font-medium">utm_campaign<input className="input-field mt-2" value={campaign} onChange={(e) => setCampaign(e.target.value)} /></label>
      <p className="break-all rounded-xl border border-theme bg-theme-surface p-3 text-sm">{url ?? "Enter a valid URL"}</p>
    </Shell>
  );
}

export function Sha256Tool() {
  const [text, setText] = useState("ranburg");
  const [hash, setHash] = useState("");
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      if (!cancelled) setHash(hex);
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);
  return (
    <Shell>
      <textarea className="input-field min-h-28" value={text} onChange={(e) => setText(e.target.value)} />
      <p className="break-all rounded-xl border border-theme bg-theme-surface p-3 font-mono text-xs">{hash}</p>
    </Shell>
  );
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#0D9B8A");
  const rgb = hexToRgb(hex);
  const [r, setR] = useState(13);
  const [g, setG] = useState(155);
  const [b, setB] = useState(138);
  return (
    <Shell>
      <label className="block text-sm font-medium">HEX<input className="input-field mt-2" value={hex} onChange={(e) => setHex(e.target.value)} /></label>
      <KPIStrip items={[{ label: "RGB", value: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "Invalid HEX", highlight: true }]} />
      <div className="h-12 rounded-xl border border-theme" style={{ background: rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : undefined }} />
      <CalculatorSlider label="R" value={r} min={0} max={255} step={1} onChange={setR} />
      <CalculatorSlider label="G" value={g} min={0} max={255} step={1} onChange={setG} />
      <CalculatorSlider label="B" value={b} min={0} max={255} step={1} onChange={setB} />
      <KPIStrip items={[{ label: "From RGB", value: rgbToHex(r, g, b) }]} />
    </Shell>
  );
}

export function WorkingDaysTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const days = workingDays(start, end);
  return (
    <Shell>
      <label className="block text-sm font-medium">Start<input type="date" className="input-field mt-2 min-h-11" value={start} onChange={(e) => setStart(e.target.value)} /></label>
      <label className="block text-sm font-medium">End<input type="date" className="input-field mt-2 min-h-11" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      <KPIStrip items={[{ label: "Working days (Mon–Fri)", value: String(days), highlight: true }]} />
    </Shell>
  );
}

export function NumberToWordsTool() {
  const [n, setN] = useState(125000);
  return (
    <Shell>
      <CalculatorSlider label="Amount" value={n} min={0} max={99_99_99_999} step={1} prefix="₹" onChange={setN} />
      <p className="rounded-xl border border-theme bg-theme-surface p-4 text-lg capitalize">{numberToIndianWords(n)} only</p>
    </Shell>
  );
}

export function HtmlEncoderTool() {
  const [text, setText] = useState("<h1>Ranburg</h1>");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const out = mode === "encode" ? htmlEscape(text) : htmlUnescape(text);
  return (
    <Shell>
      <textarea className="input-field min-h-32 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white" onClick={() => setMode("encode")}>Encode</button>
        <button type="button" className="rounded-lg border border-theme px-3 py-2 text-sm" onClick={() => setMode("decode")}>Decode</button>
      </div>
      <textarea className="input-field min-h-28 font-mono text-sm" readOnly value={out} />
    </Shell>
  );
}

export function AspectRatioTool() {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const [targetW, setTargetW] = useState(1280);
  const ratio = aspectRatio(w, h);
  const scaledH = w > 0 ? Math.round((targetW * h) / w) : 0;
  return (
    <Shell>
      <CalculatorSlider label="Width" value={w} min={1} max={7680} step={1} unit=" px" onChange={setW} />
      <CalculatorSlider label="Height" value={h} min={1} max={4320} step={1} unit=" px" onChange={setH} />
      <KPIStrip items={[{ label: "Ratio", value: `${ratio.w}:${ratio.h}`, highlight: true }]} />
      <CalculatorSlider label="Scale to width" value={targetW} min={1} max={7680} step={1} unit=" px" onChange={setTargetW} />
      <KPIStrip items={[{ label: "Scaled height", value: `${scaledH} px` }]} />
    </Shell>
  );
}

export function DuplicateLineRemoverTool() {
  const [text, setText] = useState("apple\nbanana\napple\ncherry");
  const out = uniqueLines(text);
  return (
    <Shell>
      <textarea className="input-field min-h-36 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      <textarea className="input-field min-h-28 font-mono text-sm" readOnly value={out} />
    </Shell>
  );
}

export function FindReplaceTool() {
  const [text, setText] = useState("hello world\nhello ranburg");
  const [find, setFind] = useState("hello");
  const [replace, setReplace] = useState("hi");
  const out = find ? text.split(find).join(replace) : text;
  return (
    <Shell>
      <textarea className="input-field min-h-32 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      <label className="block text-sm">Find<input className="input-field mt-1" value={find} onChange={(e) => setFind(e.target.value)} /></label>
      <label className="block text-sm">Replace<input className="input-field mt-1" value={replace} onChange={(e) => setReplace(e.target.value)} /></label>
      <textarea className="input-field min-h-28 font-mono text-sm" readOnly value={out} />
    </Shell>
  );
}

export function HoursCalculatorTool() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");
  const hours = hoursBetween(start, end);
  const mins = hours === null ? 0 : Math.round(hours * 60);
  return (
    <Shell>
      <label className="block text-sm">Start<input type="time" className="input-field mt-2 min-h-11" value={start} onChange={(e) => setStart(e.target.value)} /></label>
      <label className="block text-sm">End<input type="time" className="input-field mt-2 min-h-11" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      <KPIStrip
        items={[
          { label: "Hours", value: hours === null ? "—" : hours.toFixed(2), highlight: true },
          { label: "Minutes", value: String(mins) },
        ]}
      />
    </Shell>
  );
}

export function ReadabilityCheckerTool() {
  const [text, setText] = useState("Ranburg publishes free online tools for creators, finance, and developers. Short sentences help more people finish the page.");
  const stats = useMemo(() => fleschReadingEase(text), [text]);
  return (
    <Shell>
      <textarea className="input-field min-h-40" value={text} onChange={(e) => setText(e.target.value)} />
      <KPIStrip
        items={[
          { label: "Flesch score", value: stats.score.toFixed(1), highlight: true },
          { label: "Words", value: String(stats.words) },
          { label: "Sentences", value: String(stats.sentences) },
        ]}
      />
    </Shell>
  );
}

export function RandomNumberTool() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [value, setValue] = useState(42);
  const roll = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    setValue(lo + (buf[0] % (hi - lo + 1)));
  };
  return (
    <Shell>
      <CalculatorSlider label="Min" value={min} min={-1_000_000} max={1_000_000} step={1} onChange={setMin} />
      <CalculatorSlider label="Max" value={max} min={-1_000_000} max={1_000_000} step={1} onChange={setMax} />
      <KPIStrip items={[{ label: "Random integer", value: String(value), highlight: true }]} />
      <button type="button" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white" onClick={roll}>
        Generate
      </button>
    </Shell>
  );
}

export function DiscountCalculatorTool() {
  const [price, setPrice] = useState(1999);
  const [pct, setPct] = useState(20);
  const { saved, final } = discountPrice(price, pct);
  return (
    <Shell>
      <CalculatorSlider label="Original price" value={price} min={0} max={1_000_000} step={1} prefix="₹" onChange={setPrice} />
      <CalculatorSlider label="Discount" value={pct} min={0} max={90} step={0.5} unit="%" onChange={setPct} />
      <KPIStrip
        items={[
          { label: "You save", value: inr(saved) },
          { label: "Sale price", value: inr(final), highlight: true },
        ]}
      />
    </Shell>
  );
}

export function RdCalculatorTool() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(60);
  const maturity = rdMaturity(monthly, rate, months);
  const deposited = monthly * months;
  return (
    <Shell>
      <CalculatorSlider label="Monthly deposit" value={monthly} min={100} max={200_000} step={100} prefix="₹" onChange={setMonthly} />
      <CalculatorSlider label="Interest rate" value={rate} min={1} max={12} step={0.05} unit="%" onChange={setRate} />
      <CalculatorSlider label="Tenure" value={months} min={6} max={120} step={1} unit=" months" onChange={setMonths} />
      <KPIStrip
        items={[
          { label: "Deposited", value: inr(deposited) },
          { label: "Maturity", value: inr(maturity), highlight: true },
          { label: "Interest", value: inr(maturity - deposited) },
        ]}
      />
    </Shell>
  );
}

export function InflationCalculatorTool() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const future = inflateAmount(amount, rate, years);
  return (
    <Shell>
      <CalculatorSlider label="Today’s amount" value={amount} min={1} max={50_000_000} step={1000} prefix="₹" onChange={setAmount} />
      <CalculatorSlider label="Inflation rate" value={rate} min={0} max={20} step={0.1} unit="%" onChange={setRate} />
      <CalculatorSlider label="Years" value={years} min={1} max={40} step={1} unit=" yrs" onChange={setYears} />
      <KPIStrip items={[{ label: "Future cost", value: inr(future), highlight: true }]} />
    </Shell>
  );
}

export function CalorieCalculatorTool() {
  const [kg, setKg] = useState(70);
  const [cm, setCm] = useState(170);
  const [age, setAge] = useState(30);
  const [male, setMale] = useState(true);
  const [activity, setActivity] = useState(1.55);
  const bmr = mifflinBmr(kg, cm, age, male);
  const daily = tdee(bmr, activity);
  return (
    <Shell>
      <CalculatorSlider label="Weight" value={kg} min={30} max={200} step={0.5} unit=" kg" onChange={setKg} />
      <CalculatorSlider label="Height" value={cm} min={120} max={220} step={0.5} unit=" cm" onChange={setCm} />
      <CalculatorSlider label="Age" value={age} min={15} max={90} step={1} unit=" yrs" onChange={setAge} />
      <div className="flex gap-2">
        <button type="button" className={`rounded-lg px-3 py-2 text-sm font-semibold ${male ? "bg-accent text-white" : "bg-theme-surface"}`} onClick={() => setMale(true)}>
          Male
        </button>
        <button type="button" className={`rounded-lg px-3 py-2 text-sm font-semibold ${!male ? "bg-accent text-white" : "bg-theme-surface"}`} onClick={() => setMale(false)}>
          Female
        </button>
      </div>
      <CalculatorSlider label="Activity multiplier" value={activity} min={1.2} max={1.9} step={0.05} onChange={setActivity} />
      <KPIStrip
        items={[
          { label: "BMR", value: `${Math.round(bmr)} kcal`, highlight: true },
          { label: "TDEE", value: `${Math.round(daily)} kcal` },
        ]}
      />
      <p className="text-sm text-theme-muted">Sedentary 1.2 · moderate 1.55 · very active 1.725. Planning estimate only.</p>
    </Shell>
  );
}

export function PasswordStrengthTool() {
  const [pw, setPw] = useState("");
  const result = passwordStrength(pw);
  return (
    <Shell>
      <label className="block text-sm font-medium">
        Password (checked locally)
        <input type="password" className="input-field mt-2" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="off" />
      </label>
      <KPIStrip items={[{ label: "Strength", value: pw ? result.label : "—", highlight: true }, { label: "Score", value: pw ? `${result.score}/5` : "—" }]} />
    </Shell>
  );
}

export function DateDifferenceTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const days = calendarDays(start, end);
  return (
    <Shell>
      <label className="block text-sm font-medium">Start<input type="date" className="input-field mt-2 min-h-11" value={start} onChange={(e) => setStart(e.target.value)} /></label>
      <label className="block text-sm font-medium">End<input type="date" className="input-field mt-2 min-h-11" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
      <KPIStrip
        items={[
          { label: "Days", value: String(days), highlight: true },
          { label: "Weeks", value: (days / 7).toFixed(1) },
        ]}
      />
    </Shell>
  );
}

export function RomanNumeralTool() {
  const [n, setN] = useState(2026);
  const [roman, setRoman] = useState("MMXXVI");
  const decoded = fromRoman(roman);
  return (
    <Shell>
      <CalculatorSlider label="Number" value={n} min={1} max={3999} step={1} onChange={setN} />
      <KPIStrip items={[{ label: "Roman", value: toRoman(n), highlight: true }]} />
      <label className="block text-sm font-medium">
        Roman numeral
        <input className="input-field mt-2 uppercase" value={roman} onChange={(e) => setRoman(e.target.value)} />
      </label>
      <KPIStrip items={[{ label: "Decoded", value: decoded === null ? "—" : String(decoded) }]} />
    </Shell>
  );
}

export function TextToBinaryTool() {
  const [text, setText] = useState("Ranburg");
  const [binary, setBinary] = useState(textToBinary("Ranburg"));
  return (
    <Shell>
      <textarea className="input-field min-h-24 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      <textarea className="input-field min-h-24 font-mono text-xs" readOnly value={textToBinary(text)} />
      <label className="block text-sm font-medium">
        Binary to text
        <textarea className="input-field mt-2 min-h-20 font-mono text-xs" value={binary} onChange={(e) => setBinary(e.target.value)} />
      </label>
      <p className="rounded-xl border border-theme bg-theme-surface p-3 text-sm">{binaryToText(binary)}</p>
    </Shell>
  );
}

export function TipCalculatorTool() {
  const [bill, setBill] = useState(2400);
  const [pct, setPct] = useState(10);
  const [people, setPeople] = useState(2);
  const { tip, total, each } = tipSplit(bill, pct, people);
  return (
    <Shell>
      <CalculatorSlider label="Bill" value={bill} min={0} max={1_000_000} step={10} prefix="₹" onChange={setBill} />
      <CalculatorSlider label="Tip" value={pct} min={0} max={40} step={0.5} unit="%" onChange={setPct} />
      <CalculatorSlider label="People" value={people} min={1} max={20} step={1} onChange={setPeople} />
      <KPIStrip
        items={[
          { label: "Tip", value: inr(tip) },
          { label: "Total", value: inr(total), highlight: true },
          { label: "Each", value: inr(each) },
        ]}
      />
    </Shell>
  );
}

export function AverageCalculatorTool() {
  const [text, setText] = useState("80\n90\n70\n100");
  const values = text
    .split(/[\s,;]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
  const avg = mean(values);
  return (
    <Shell>
      <textarea className="input-field min-h-32 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      <KPIStrip
        items={[
          { label: "Count", value: String(values.length) },
          { label: "Average", value: avg === null ? "—" : avg.toFixed(2), highlight: true },
        ]}
      />
    </Shell>
  );
}

export function PxToRemTool() {
  const [px, setPx] = useState(16);
  const [base, setBase] = useState(16);
  const rem = pxToRem(px, base);
  return (
    <Shell>
      <CalculatorSlider label="Pixels" value={px} min={1} max={128} step={1} unit=" px" onChange={setPx} />
      <CalculatorSlider label="Root font size" value={base} min={8} max={24} step={1} unit=" px" onChange={setBase} />
      <KPIStrip items={[{ label: "rem", value: `${rem.toFixed(4)} rem`, highlight: true }]} />
    </Shell>
  );
}

export function WaterIntakeTool() {
  const [kg, setKg] = useState(70);
  const liters = waterLiters(kg);
  return (
    <Shell>
      <CalculatorSlider label="Weight" value={kg} min={30} max={200} step={0.5} unit=" kg" onChange={setKg} />
      <KPIStrip
        items={[
          { label: "Litres / day", value: liters.toFixed(2), highlight: true },
          { label: "ml / day", value: String(Math.round(liters * 1000)) },
        ]}
      />
      <p className="text-sm text-theme-muted">Rule of thumb only — not medical advice.</p>
    </Shell>
  );
}
