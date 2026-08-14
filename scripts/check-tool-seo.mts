import { TOOLS_CONFIG } from "../src/lib/toolsConfig.ts";
import { generateToolSeoSections } from "../src/lib/toolSeoGenerator.ts";
import {
  buildToolPageTitle,
  buildToolPageDescription,
  buildToolPageH1,
} from "../src/lib/toolPageSeo.ts";
import { PRIORITY_INDEX_TOOL_SLUGS } from "../src/lib/seoGrowthConfig.ts";

const titles = new Map<string, string[]>();
let titleLong = 0;
let descShort = 0;
let descLong = 0;
let min = 99999;
let max = 0;
let sum = 0;
let under = 0;

for (const tool of TOOLS_CONFIG) {
  const title = buildToolPageTitle(tool);
  const desc = buildToolPageDescription(tool);
  const h1 = buildToolPageH1(tool);
  const words = generateToolSeoSections(tool).wordCountHint;

  const key = title.toLowerCase();
  titles.set(key, [...(titles.get(key) ?? []), tool.slug]);

  if (title.length > 60) titleLong++;
  if (desc.length < 120) descShort++;
  if (desc.length > 160) descLong++;
  min = Math.min(min, words);
  max = Math.max(max, words);
  sum += words;
  if (words < 900) under++;

  if (PRIORITY_INDEX_TOOL_SLUGS.includes(tool.slug as (typeof PRIORITY_INDEX_TOOL_SLUGS)[number])) {
    process.stdout.write(
      `${tool.slug}\n  H1: ${h1}\n  TITLE (${title.length}): ${title}\n  DESC (${desc.length}): ${desc}\n`
    );
  }
}

const dupes = [...titles.entries()].filter(([, slugs]) => slugs.length > 1);
process.stdout.write(
  `\nwords min/avg/max/under900: ${min} ${Math.round(sum / TOOLS_CONFIG.length)} ${max} ${under}\n`
);
process.stdout.write(`titles >60: ${titleLong}  desc <120: ${descShort}  desc >160: ${descLong}\n`);
process.stdout.write(`duplicate titles: ${dupes.length}\n`);
for (const [title, slugs] of dupes) {
  process.stdout.write(`  ${title} → ${slugs.join(", ")}\n`);
}
