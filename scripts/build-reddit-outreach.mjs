/**
 * Builds docs/REDDIT_OUTREACH_100.md from PullPush JSON dumps in agent-tools
 * or by fetching live (optional --fetch).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const AGENT_TOOLS = path.resolve(
  process.env.USERPROFILE || process.env.HOME || "",
  ".cursor/projects/c-Users-ranbu-OneDrive-Documents-Freedom-Security-Solutions-Environment-FreedomPreProduction-ranburg-website/agent-tools"
);

const KEYWORDS = {
  finance_emi: [
    /\bemi\b/i,
    /home\s*loan/i,
    /personal\s*loan/i,
    /car\s*loan/i,
    /amortiz/i,
    /tenure/i,
    /interest\s*rate/i,
  ],
  finance_sip: [/\bsip\b/i, /mutual\s*fund/i, /corpus/i, /invest(ing|ment)/i],
  finance_gst: [/\bgst\b/i, /invoice/i, /cgst|sgst|igst/i],
  finance_prepay: [/prepay/i, /foreclos/i, /pre-?payment/i],
  youtube: [
    /youtube/i,
    /\brpm\b/i,
    /social\s*blade/i,
    /monetiz/i,
    /adsense/i,
    /earnings?/i,
    /revenue/i,
    /cpm/i,
    /subscriber/i,
  ],
  instagram: [/instagram/i, /hashtag/i, /reels?/i, /influencer/i],
  files: [
    /pdf/i,
    /compress/i,
    /heic/i,
    /jpg|png|webp/i,
    /tinywow/i,
    /iloveimg|ilovepdf/i,
    /converter/i,
  ],
  developer: [
    /json/i,
    /password/i,
    /qr\s*code/i,
    /formatter/i,
    /regex/i,
    /developer\s*tool/i,
  ],
};

const MESSAGES = {
  finance_emi: `If you're comparing EMI / tenure scenarios, this free browser EMI calculator is handy (no signup): https://www.ranburg.com/tools/emi

Plug in principal, rate, and years - it shows monthly EMI instantly. Cross-check with your bank sanction letter before locking anything.`,
  finance_sip: `For a quick SIP corpus estimate (monthly amount x years x expected return), this free SIP calculator works in-browser with no account: https://www.ranburg.com/tools/sip

Treat it as planning only - actual MF returns vary.`,
  finance_gst: `If you need a quick inclusive/exclusive GST split (CGST/SGST/IGST style), this free GST calculator is simple and signup-free: https://www.ranburg.com/tools/gst-calculator`,
  finance_prepay: `Before you decide to prepay / foreclose, it helps to model interest saved vs charges. Free foreclosure-style calculator (no signup): https://www.ranburg.com/tools/loan-foreclosure-calculator

Still confirm final numbers with your lender.`,
  youtube: `If you want a ballpark (not Studio-accurate) earnings range, this free YouTube revenue calculator lets you stress-test views x RPM: https://www.ranburg.com/tools/youtube-revenue-calculator

For a public channel peek: https://www.ranburg.com/tools/youtube-channel-insights

Real money still lives in YouTube Studio - use these for planning only.`,
  instagram: `If you're building caption tags or estimating creator income ranges:

Hashtags (free, no signup): https://www.ranburg.com/tools/instagram-hashtag-generator
Earnings estimate: https://www.ranburg.com/tools/instagram-revenue-calculator

Always trim tags for relevance - don't paste 30 random ones.`,
  files: `If you need a free no-account file utility, these run in the browser on Ranburg:

PDF merge: https://www.ranburg.com/tools/pdf-merge
Image compress: https://www.ranburg.com/tools/image-compressor
JPG to PNG: https://www.ranburg.com/tools/jpg-to-png
HEIC to JPG: https://www.ranburg.com/tools/heic-to-jpg`,
  developer: `Handy free browser utils (no signup):

JSON formatter: https://www.ranburg.com/tools/json-formatter
Password generator: https://www.ranburg.com/tools/password-generator
QR generator: https://www.ranburg.com/tools/qr-generator`,
  general: `Sharing a free tools suite we use for everyday stuff (calculators, social estimates, PDF/image utils) - no signup: https://www.ranburg.com/tools`,
};

function classify(title = "", selftext = "", subreddit = "") {
  const blob = `${title} ${selftext} ${subreddit}`;
  const titleLower = title.toLowerCase();

  // Skip service offers / spam / unrelated
  if (
    /i'?m your guy|dm me|for hire|hiring|scam(ming)?|refund claim|portfolio review only/i.test(
      title
    )
  ) {
    return null;
  }

  // Prefer ask / tool / calc intent in title or body
  const hasAskIntent =
    /\?|how (much|do|to|can)|looking for|recommend|suggest|which |any (good|free)|need(s)? (a |an |to )?|calculate|calculator|tool|estimate|help (me|with)/i.test(
      `${title} ${selftext}`
    );

  for (const [key, patterns] of Object.entries(KEYWORDS)) {
    if (!patterns.some((re) => re.test(blob))) continue;
    // For broad SIP/invest posts, require ask intent or explicit calculator mention
    if (
      (key === "finance_sip" || key === "finance_emi") &&
      !/calculator|emi|sip|gst|prepay|foreclos|tenure|amort/i.test(titleLower) &&
      !hasAskIntent
    ) {
      continue;
    }
    if (key === "youtube" && /\b(rpm)\b/i.test(title) && !/youtube|cpm|adsense|monetiz|social\s*blade|earnings|revenue|views|shorts/i.test(blob)) {
      continue;
    }
    return key;
  }
  return null;
}

function loadJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

function extractPosts(files) {
  const byUrl = new Map();
  for (const file of files) {
    let raw;
    try {
      raw = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (!raw.includes('"permalink"')) continue;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    const data = parsed.data || [];
    for (const post of data) {
      if (!post?.permalink || !post?.title) continue;
      if (post.removed_by_category || post.selftext === "[deleted]" || post.selftext === "[removed]") {
        continue;
      }
      const url = post.permalink.startsWith("http")
        ? post.permalink.replace(/\/$/, "")
        : `https://www.reddit.com${post.permalink}`.replace(/\/$/, "");
      const category = classify(post.title, post.selftext || "", post.subreddit || "");
      if (!category) continue;
      // Drop obvious mismatches (car RPM etc.)
      if (category === "youtube" && /\b(rpm)\b/i.test(post.title) && !/youtube|cpm|adsense|monetiz|social\s*blade|earnings|revenue|views/i.test(`${post.title} ${post.selftext}`)) {
        continue;
      }
      byUrl.set(url, {
        title: post.title,
        url,
        subreddit: post.subreddit,
        category,
        created_utc: post.created_utc,
        score: post.score ?? 0,
        num_comments: post.num_comments ?? 0,
      });
    }
  }
  return [...byUrl.values()].sort((a, b) => (b.created_utc || 0) - (a.created_utc || 0));
}

async function fetchMore() {
  const queries = [
    ["EMI", "IndiaInvestments"],
    ["SIP", "IndiaInvestments"],
    ["home loan", "IndiaInvestments"],
    ["prepayment", "IndiaInvestments"],
    ["EMI", "personalfinanceindia"],
    ["SIP", "personalfinanceindia"],
    ["calculator", "personalfinanceindia"],
    ["GST", "IndiaTax"],
    ["loan", "IndiaTax"],
    ["earnings", "NewTubers"],
    ["monetization", "NewTubers"],
    ["SocialBlade", "NewTubers"],
    ["RPM", "PartneredYoutube"],
    ["hashtag", "Instagram"],
    ["hashtags", "InstagramMarketing"],
    ["PDF", "software"],
    ["compress", "InternetIsBeautiful"],
    ["JSON", "webdev"],
    ["password", "webdev"],
    ["QR", "webdev"],
    ["SIP", "MutualfundsIndia"],
    ["EMI", "india"],
    ["YouTube money", "NewTubers"],
    ["AdSense", "NewTubers"],
    ["HEIC", "iphone"],
  ];
  const outDir = path.join(ROOT, "docs", "_reddit_cache");
  fs.mkdirSync(outDir, { recursive: true });
  const files = [];
  for (const [q, sr] of queries) {
    const u = `https://api.pullpush.io/reddit/search/submission/?q=${encodeURIComponent(q)}&subreddit=${encodeURIComponent(sr)}&size=50&sort=desc`;
    const safe = `${sr}_${q}`.replace(/[^a-z0-9]+/gi, "_");
    const dest = path.join(outDir, `${safe}.json`);
    try {
      const res = await fetch(u, { headers: { "User-Agent": "ranburg-outreach/1.0" } });
      const text = await res.text();
      fs.writeFileSync(dest, text);
      files.push(dest);
      console.log("fetched", sr, q, text.slice(0, 40));
      await new Promise((r) => setTimeout(r, 2500));
    } catch (e) {
      console.error("fail", sr, q, e.message);
    }
  }
  return files;
}

function pickBalanced(posts, total = 110) {
  const order = [
    "finance_emi",
    "finance_sip",
    "finance_gst",
    "finance_prepay",
    "youtube",
    "instagram",
    "files",
    "developer",
  ];
  const buckets = Object.fromEntries(order.map((k) => [k, []]));
  for (const p of posts) {
    if (buckets[p.category]) buckets[p.category].push(p);
  }
  const per = Math.ceil(total / order.filter((k) => buckets[k].length).length);
  const picked = [];
  const used = new Set();
  for (const k of order) {
    for (const p of buckets[k].slice(0, per)) {
      if (used.has(p.url)) continue;
      used.add(p.url);
      picked.push(p);
    }
  }
  // Fill remainder from newest overall
  for (const p of posts) {
    if (picked.length >= total) break;
    if (used.has(p.url)) continue;
    used.add(p.url);
    picked.push(p);
  }
  return picked.slice(0, total);
}

function renderMarkdown(posts) {
  const picked = pickBalanced(posts, 110);
  const lines = [];
  lines.push("# Reddit outreach list (100+) - Ranburg");
  lines.push("");
  lines.push("**Generated for value-first replies only.** Do not mass-spam identical comments.");
  lines.push("Reddit bans promo spam. Only reply when the post is asking for a calculator/tool/estimate.");
  lines.push("Prefer 5-10 thoughtful replies/day over dumping 100 at once.");
  lines.push("");
  lines.push("## Rules");
  lines.push("1. Read the thread first - adapt the message if their numbers differ.");
  lines.push("2. Disclose naturally (free tool link), never claim to be unrelated if asked.");
  lines.push("3. Skip locked/archived threads and self-promo-forbidden subs.");
  lines.push("4. If a post is old (>1 year) and inactive, skip.");
  lines.push("");
  lines.push(`**Posts in this list:** ${picked.length}`);
  lines.push("");

  let i = 1;
  for (const p of picked) {
    const msg = MESSAGES[p.category] || MESSAGES.general;
    const title = p.title.replace(/\n/g, " ").replace(/[^\x20-\x7E]/g, "").slice(0, 140);
    lines.push(`### ${i}. r/${p.subreddit} - ${title}`);
    lines.push(`- **URL:** ${p.url}`);
    lines.push(`- **Category:** ${p.category}`);
    lines.push(`- **Suggested reply:**`);
    lines.push("");
    lines.push("```");
    lines.push(msg);
    lines.push("```");
    lines.push("");
    i++;
  }

  lines.push("## Fresh search links (find new posts weekly)");
  lines.push("");
  const searches = [
    "https://www.reddit.com/r/IndiaInvestments/search/?q=EMI%20calculator&restrict_sr=1&sort=new",
    "https://www.reddit.com/r/IndiaInvestments/search/?q=SIP&restrict_sr=1&sort=new",
    "https://www.reddit.com/r/personalfinanceindia/search/?q=home%20loan%20EMI&restrict_sr=1&sort=new",
    "https://www.reddit.com/r/NewTubers/search/?q=revenue%20calculator&restrict_sr=1&sort=new",
    "https://www.reddit.com/r/NewTubers/search/?q=RPM&restrict_sr=1&sort=new",
    "https://www.reddit.com/r/Instagram/search/?q=hashtag%20generator&restrict_sr=1&sort=new",
    "https://www.reddit.com/search/?q=free%20PDF%20merge%20online&sort=new",
    "https://www.reddit.com/search/?q=image%20compressor%20free%20online&sort=new",
    "https://www.reddit.com/r/webdev/search/?q=JSON%20formatter&restrict_sr=1&sort=new",
  ];
  for (const s of searches) lines.push(`- ${s}`);
  lines.push("");
  lines.push("## Regenerate");
  lines.push("```bash");
  lines.push("node scripts/build-reddit-outreach.mjs --fetch");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

const doFetch = process.argv.includes("--fetch");
const files = [
  ...loadJsonFiles(AGENT_TOOLS),
  ...loadJsonFiles(path.join(ROOT, "docs", "_reddit_cache")),
];

if (doFetch) {
  const more = await fetchMore();
  files.push(...more);
}

const posts = extractPosts(files);
console.log("relevant posts:", posts.length);
const md = renderMarkdown(posts);
const out = path.join(ROOT, "docs", "REDDIT_OUTREACH_100.md");
fs.writeFileSync(out, md);
console.log("wrote", out, "items", Math.min(120, posts.length));
