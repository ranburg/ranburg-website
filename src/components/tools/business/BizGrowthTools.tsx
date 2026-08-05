"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import { KPIStrip, ScenarioCompare } from "@/components/tools/viz";
import { CopyResultPanel } from "@/components/tools/viz/CopyResultPanel";

function ToolShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BurnRateRunwayTool() {
  const [cash, setCash] = useState(500000);
  const [expenses, setExpenses] = useState(80000);
  const [revenue, setRevenue] = useState(25000);
  const [growthPct, setGrowthPct] = useState(5);
  const [useGrowth, setUseGrowth] = useState(false);

  const result = useMemo(() => {
    const grossBurn = expenses;
    const netBurn = expenses - revenue;
    if (!useGrowth) {
      const runwayMonths = netBurn <= 0 ? Infinity : cash / netBurn;
      const cashOut =
        netBurn <= 0
          ? null
          : new Date(Date.now() + runwayMonths * 30.44 * 24 * 60 * 60 * 1000);
      return {
        grossBurn,
        netBurn,
        runwayMonths,
        cashOut,
        defaultAlive: netBurn <= 0,
      };
    }
    let balance = cash;
    let month = 0;
    let rev = revenue;
    const growth = 1 + growthPct / 100;
    while (balance > 0 && month < 600) {
      const burn = expenses - rev;
      balance -= burn;
      if (balance <= 0) break;
      month++;
      rev *= growth;
    }
    const runwayMonths = month >= 600 ? Infinity : month + (balance <= 0 ? 0 : 0);
    return {
      grossBurn,
      netBurn: expenses - revenue,
      runwayMonths: month >= 600 ? Infinity : month,
      cashOut: month >= 600 ? null : new Date(Date.now() + month * 30.44 * 24 * 60 * 60 * 1000),
      defaultAlive: month >= 600,
    };
  }, [cash, expenses, revenue, growthPct, useGrowth]);

  const runwayLabel =
    result.runwayMonths === Infinity
      ? result.defaultAlive
        ? "Default alive"
        : "600+ mo"
      : `${result.runwayMonths.toFixed(1)} mo`;

  return (
    <ToolShell>
      <CalculatorSlider label="Cash on hand" value={cash} min={0} max={5000000} step={10000} prefix="$" onChange={setCash} />
      <CalculatorSlider label="Monthly expenses" value={expenses} min={0} max={500000} step={1000} prefix="$" onChange={setExpenses} />
      <CalculatorSlider label="Monthly revenue" value={revenue} min={0} max={500000} step={1000} prefix="$" onChange={setRevenue} />
      <label className="inline-flex items-center gap-2 text-sm text-theme-muted">
        <input type="checkbox" checked={useGrowth} onChange={(e) => setUseGrowth(e.target.checked)} />
        Model monthly revenue growth (default alive check)
      </label>
      {useGrowth && (
        <CalculatorSlider label="Revenue growth / month" value={growthPct} min={0} max={30} step={0.5} unit="%" onChange={setGrowthPct} />
      )}
      <KPIStrip
        items={[
          { label: "Gross burn", value: fmtUsd(result.grossBurn) },
          { label: "Net burn", value: fmtUsd(result.netBurn), highlight: true },
          { label: "Runway", value: runwayLabel },
          {
            label: "Cash-out date",
            value: result.cashOut ? fmtDate(result.cashOut) : result.defaultAlive ? "N/A" : "—",
          },
        ]}
      />
      <p className="text-xs text-theme-subtle">
        Net burn = expenses − revenue. Negative net burn means you are cash-flow positive. Growth mode compounds revenue monthly until cash runs out or 50 years.
      </p>
    </ToolShell>
  );
}

export function FreelancerRateTool() {
  const [salary, setSalary] = useState(85000);
  const [taxPct, setTaxPct] = useState(28);
  const [benefitsPct, setBenefitsPct] = useState(15);
  const [hoursWeek, setHoursWeek] = useState(30);
  const [weeksYear, setWeeksYear] = useState(48);

  const result = useMemo(() => {
    const billableHours = hoursWeek * weeksYear;
    const overhead = salary * (benefitsPct / 100);
    const afterTaxTarget = salary / (1 - taxPct / 100);
    const totalNeeded = afterTaxTarget + overhead;
    const hourly = billableHours > 0 ? totalNeeded / billableHours : 0;
    const dayRate = hourly * 8;
    return { billableHours, hourly, dayRate, totalNeeded };
  }, [salary, taxPct, benefitsPct, hoursWeek, weeksYear]);

  return (
    <ToolShell>
      <CalculatorSlider label="Desired annual salary (take-home target base)" value={salary} min={30000} max={300000} step={1000} prefix="$" onChange={setSalary} />
      <CalculatorSlider label="Effective tax rate" value={taxPct} min={10} max={45} step={1} unit="%" onChange={setTaxPct} />
      <CalculatorSlider label="Benefits / overhead" value={benefitsPct} min={0} max={40} step={1} unit="%" onChange={setBenefitsPct} />
      <CalculatorSlider label="Billable hours / week" value={hoursWeek} min={10} max={50} step={1} unit=" hrs" onChange={setHoursWeek} />
      <CalculatorSlider label="Working weeks / year" value={weeksYear} min={40} max={52} step={1} unit=" wks" onChange={setWeeksYear} />
      <KPIStrip
        items={[
          { label: "Hourly rate", value: fmtUsd(result.hourly), highlight: true },
          { label: "Day rate (8h)", value: fmtUsd(result.dayRate) },
          { label: "Billable hours/yr", value: `${result.billableHours}` },
        ]}
      />
      <p className="text-xs text-theme-subtle">
        Formula: (salary ÷ (1 − tax%) + benefits) ÷ billable hours. Adjust tax and overhead for your country and business costs.
      </p>
    </ToolShell>
  );
}

function zTestTwoProportion(c1: number, n1: number, c2: number, n2: number) {
  if (n1 === 0 || n2 === 0) return { z: 0, p: 1 };
  const p1 = c1 / n1;
  const p2 = c2 / n2;
  const pPool = (c1 + c2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  if (se === 0) return { z: 0, p: 1 };
  const z = (p1 - p2) / se;
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  return { z, p };
}

function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * Math.abs(x));
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function sampleSizeForMde(baseline: number, mdePct: number, power = 0.8, alpha = 0.05) {
  const p = baseline / 100;
  const d = (mdePct / 100) * p;
  if (d <= 0 || p <= 0 || p >= 1) return 0;
  const zAlpha = 1.96;
  const zBeta = 0.84;
  const n = (2 * p * (1 - p) * Math.pow(zAlpha + zBeta, 2)) / Math.pow(d, 2);
  return Math.ceil(n);
}

export function AbTestSignificanceTool() {
  const [visA, setVisA] = useState(10000);
  const [convA, setConvA] = useState(320);
  const [visB, setVisB] = useState(10000);
  const [convB, setConvB] = useState(380);
  const [baseline, setBaseline] = useState(3);
  const [mde, setMde] = useState(10);

  const sig = useMemo(() => {
    const { z, p } = zTestTwoProportion(convA, visA, convB, visB);
    const rateA = visA > 0 ? (convA / visA) * 100 : 0;
    const rateB = visB > 0 ? (convB / visB) * 100 : 0;
    const lift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;
    const significant = p < 0.05;
    return { z, p, rateA, rateB, lift, significant };
  }, [visA, convA, visB, convB]);

  const needed = useMemo(() => sampleSizeForMde(baseline, mde), [baseline, mde]);

  return (
    <ToolShell>
      <p className="text-sm font-semibold text-theme-heading">Variant results</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <CalculatorSlider label="Visitors A" value={visA} min={100} max={500000} step={100} onChange={setVisA} />
        <CalculatorSlider label="Conversions A" value={convA} min={0} max={visA} step={1} onChange={setConvA} />
        <CalculatorSlider label="Visitors B" value={visB} min={100} max={500000} step={100} onChange={setVisB} />
        <CalculatorSlider label="Conversions B" value={convB} min={0} max={visB} step={1} onChange={setConvB} />
      </div>
      <KPIStrip
        items={[
          { label: "Rate A", value: `${sig.rateA.toFixed(2)}%` },
          { label: "Rate B", value: `${sig.rateB.toFixed(2)}%`, highlight: true },
          { label: "Lift B vs A", value: `${sig.lift >= 0 ? "+" : ""}${sig.lift.toFixed(1)}%` },
          { label: "p-value", value: sig.p < 0.001 ? "<0.001" : sig.p.toFixed(4) },
        ]}
      />
      <p className={`text-sm font-medium ${sig.significant ? "text-emerald-600" : "text-theme-muted"}`}>
        {sig.significant
          ? `Statistically significant at 95% confidence (|z| = ${Math.abs(sig.z).toFixed(2)}).`
          : `Not significant at 95% confidence (|z| = ${Math.abs(sig.z).toFixed(2)}). Need more data or larger effect.`}
      </p>
      <ScenarioCompare
        title="Sample size planner (per variant, 80% power)"
        columnA="Inputs"
        columnB="Estimate"
        rows={[
          { label: "Baseline conversion", a: `${baseline}%`, b: "—" },
          { label: "Minimum detectable effect", a: `${mde}% relative`, b: "—" },
          { label: "Visitors needed / variant", a: "—", b: needed.toLocaleString() },
        ]}
      />
      <CalculatorSlider label="Baseline conversion %" value={baseline} min={0.5} max={20} step={0.1} unit="%" onChange={setBaseline} />
      <CalculatorSlider label="MDE (relative % lift)" value={mde} min={1} max={50} step={1} unit="%" onChange={setMde} />
    </ToolShell>
  );
}

const AI_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "PerplexityBot",
  "Bytespider",
  "CCBot",
  "anthropic-ai",
  "ChatGPT-User",
  "OAI-SearchBot",
] as const;

type BotRule = "allow" | "disallow" | "not mentioned";

function parseRobotsForBot(text: string, bot: string): BotRule {
  const blocks: { agents: string[]; allow: string[]; disallow: string[] }[] = [];
  let current: { agents: string[]; allow: string[]; disallow: string[] } | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const ua = line.match(/^User-agent:\s*(.+)$/i);
    if (ua) {
      if (current) blocks.push(current);
      current = { agents: [ua[1].trim()], allow: [], disallow: [] };
      continue;
    }
    if (!current) current = { agents: ["*"], allow: [], disallow: [] };
    const allow = line.match(/^Allow:\s*(.*)$/i);
    const disallow = line.match(/^Disallow:\s*(.*)$/i);
    if (allow) current.allow.push(allow[1].trim());
    if (disallow) current.disallow.push(disallow[1].trim());
  }
  if (current) blocks.push(current);

  const botLower = bot.toLowerCase();
  const matchBlock =
    blocks.find((b) => b.agents.some((a) => a.toLowerCase() === botLower || botLower.includes(a.toLowerCase()))) ??
    blocks.find((b) => b.agents.includes("*"));

  if (!matchBlock) return "not mentioned";
  if (matchBlock.disallow.some((p) => p === "/" || p === "/*")) return "disallow";
  if (matchBlock.disallow.length === 0) return "allow";
  if (matchBlock.allow.includes("/")) return "allow";
  return "disallow";
}

export function AiCrawlerRobotsCheckerTool() {
  const [robots, setRobots] = useState(
    `User-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: *\nDisallow: /admin/`
  );

  const rows = useMemo(
    () =>
      AI_BOTS.map((bot) => ({
        bot,
        rule: parseRobotsForBot(robots, bot),
      })),
    [robots]
  );

  return (
    <ToolShell>
      <textarea
        value={robots}
        onChange={(e) => setRobots(e.target.value)}
        rows={10}
        className="input-field font-mono text-sm"
        placeholder="Paste robots.txt content"
      />
      <div className="overflow-x-auto rounded-xl border border-theme">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-theme bg-theme-surface/60 text-left text-xs uppercase text-theme-subtle">
              <th className="p-3">AI crawler</th>
              <th className="p-3">Effective rule</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.bot} className="border-b border-theme/60">
                <td className="p-3 font-mono font-semibold text-theme-heading">{r.bot}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                      r.rule === "allow"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : r.rule === "disallow"
                          ? "bg-red-500/15 text-red-600"
                          : "bg-theme-surface text-theme-muted"
                    }`}
                  >
                    {r.rule}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-theme-subtle">Simplified robots.txt parser for common AI bots. Verify against your live robots.txt and CDN rules before relying on results.</p>
    </ToolShell>
  );
}

export function LlmsTxtGeneratorTool() {
  const [siteName, setSiteName] = useState("Ranburg Tools");
  const [lines, setLines] = useState(
    "https://ranburg.com/tools | Free online tools\nhttps://ranburg.com/tools/sip-calculator | SIP Calculator\nhttps://ranburg.com/blog | Blog"
  );

  const output = useMemo(() => {
    const entries = lines
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [url, title] = l.split("|").map((s) => s.trim());
        return title ? `- [${title}](${url})` : `- ${url}`;
      });
    if (entries.length === 0) return "";
    return `# ${siteName}\n\n> Curated links for LLM crawlers and assistants.\n\n## Docs\n\n${entries.join("\n")}\n`;
  }, [siteName, lines]);

  return (
    <ToolShell>
      <div>
        <label className="text-sm font-medium text-theme-muted">Site / project name</label>
        <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="input-field mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-theme-muted">URLs (one per line: url | optional title)</label>
        <textarea value={lines} onChange={(e) => setLines(e.target.value)} rows={8} className="input-field mt-1 font-mono text-sm" />
      </div>
      <CopyResultPanel title="llms.txt" text={output} emptyHint="Add URL lines to generate llms.txt" />
    </ToolShell>
  );
}

function b64UrlDecode(str: string): string {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return decodeURIComponent(
    atob(b64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyNote, setVerifyNote] = useState<string | null>(null);

  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return null;
    try {
      const header = JSON.parse(b64UrlDecode(parts[0]));
      const payload = JSON.parse(b64UrlDecode(parts[1]));
      let expDate: string | null = null;
      if (typeof payload.exp === "number") {
        expDate = new Date(payload.exp * 1000).toLocaleString();
      }
      return { header, payload, expDate, signature: parts[2] ?? "" };
    } catch {
      return null;
    }
  }, [token]);

  const verifyHs256 = async () => {
    if (!decoded || !secret) return;
    const parts = token.trim().split(".");
    if (parts.length !== 3) return;
    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const data = `${parts[0]}.${parts[1]}`;
      const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
      const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      setVerifyNote(b64 === parts[2] ? "HS256 signature valid for provided secret." : "Signature does not match secret.");
    } catch {
      setVerifyNote("Verification failed.");
    }
  };

  return (
    <ToolShell>
      <p className="rounded-lg border border-theme-subtle bg-theme-surface/50 p-3 text-xs text-theme-subtle">
        Decoding happens entirely in your browser. Never paste production secrets on shared machines.
      </p>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows={4}
        className="input-field font-mono text-sm"
        placeholder="Paste JWT (header.payload.signature)"
      />
      {decoded ? (
        <>
          <KPIStrip
            items={[
              { label: "Algorithm", value: String(decoded.header.alg ?? "—"), highlight: true },
              { label: "Expires", value: decoded.expDate ?? "No exp claim" },
            ]}
          />
          <CopyResultPanel title="Header" text={JSON.stringify(decoded.header, null, 2)} />
          <CopyResultPanel title="Payload" text={JSON.stringify(decoded.payload, null, 2)} />
          <div className="glass-card space-y-3 rounded-xl p-4">
            <p className="text-sm font-semibold text-theme-heading">Optional HS256 signature check</p>
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              type="password"
              placeholder="HMAC secret (optional)"
              className="input-field"
            />
            <button type="button" onClick={verifyHs256} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              Verify signature
            </button>
            {verifyNote && <p className="text-sm text-theme-muted">{verifyNote}</p>}
            <p className="text-xs text-theme-subtle">RS256 and other asymmetric algorithms are not verified here unless you add a public key flow.</p>
          </div>
        </>
      ) : (
        token.trim() && <p className="text-sm text-red-500">Invalid JWT — check format and base64url segments.</p>
      )}
    </ToolShell>
  );
}
