import type { BlogPost, BlogSection, BlogFaq } from "./blogTypes";
import type { SeoBlogTopic } from "./seoBlogTopics";
import { getToolBySlug } from "./toolsConfig";

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function readTimeFromSections(sections: BlogSection[]): string {
  const words = sections.reduce((n, s) => n + wordCount(s.text), 0);
  const mins = Math.max(6, Math.ceil(words / 200));
  return `${mins} min`;
}

function toolLabel(slug: string): string {
  return slug.replace(/-/g, " ");
}

export function generateSeoBlogPost(topic: SeoBlogTopic, dateIndex: number): BlogPost {
  const primaryTool = topic.tools[0];
  const tool = getToolBySlug(primaryTool);
  const toolTitle = tool?.title ?? toolLabel(primaryTool);
  const toolPath = `/tools/${primaryTool}`;
  const secondaryTools = topic.tools.slice(1);
  const toolNames = topic.tools.map(toolLabel).join(", ");

  const sections: BlogSection[] = [
    { type: "h2", text: `Try the Free ${toolTitle}` },
    {
      type: "p",
      text: `This article is built around Ranburg's ${toolTitle} — a free online tool at ranburg.com/tools/${primaryTool}. ${topic.excerpt} Jump to the tool anytime using the highlighted card at the top of this page.`,
    },
    { type: "h2", text: `Understanding ${topic.keyword}` },
    {
      type: "p",
      text: `${topic.excerpt} Whether you are a creator, marketer, freelancer, or small business owner, mastering ${topic.keyword} helps you make faster decisions with real numbers instead of guesswork. Ranburg.com publishes free browser-based tools so you can analyze, calculate, and format without signups or paywalls.`,
    },
    {
      type: "p",
      text: topic.angle1,
    },
    { type: "h2", text: `Why ${topic.keyword} Matters in 2026` },
    {
      type: "p",
      text: `Search interest around ${topic.keyword} continues to grow as more professionals move workflows online. Informational content paired with practical utilities ranks well because readers want both explanation and immediate action. This guide focuses on ${topic.searchIntent.toLowerCase()} intent: learn the concept, avoid common mistakes, and use Ranburg's ${toolLabel(primaryTool)} for instant results.`,
    },
    {
      type: "p",
      text: topic.angle2,
    },
    { type: "h2", text: "Step-by-Step: How to Use Ranburg's Free Tool" },
    {
      type: "p",
      text: `Open the ${toolLabel(primaryTool)} at ranburg.com${toolPath}. Enter your inputs, review outputs in real time, and adjust parameters to compare scenarios. The tool runs in your browser — your data stays on your device unless the utility explicitly calls a public API (for example live currency rates or public social profile stats). Bookmark the page for repeat use and share the link with teammates who need the same workflow.`,
    },
    { type: "h3", text: "Quick checklist" },
    {
      type: "p",
      text: `1) Define your goal related to ${topic.keyword}. 2) Gather baseline numbers or text to process. 3) Run the ${toolLabel(primaryTool)} and note outputs. 4) Compare at least two scenarios. 5) Document assumptions before using results in client work, tax filing, or investment decisions.`,
    },
    { type: "h2", text: "Common Mistakes to Avoid" },
    {
      type: "p",
      text: topic.angle3,
    },
    {
      type: "p",
      text: `Another frequent error is treating estimates as guarantees. Tools that project revenue, engagement, or loan savings provide planning ranges — always validate with official statements, platform analytics, or professional advice when money or compliance is involved.`,
    },
    { type: "h2", text: "Best Practices and Pro Tips" },
    {
      type: "p",
      text: topic.angle4,
    },
    {
      type: "p",
      text: `Pair this guide with related Ranburg utilities (${toolNames}) to build a repeatable workflow. Strong internal linking between tutorials and tools improves discovery and helps search engines understand topical authority across the ${topic.cluster} cluster.`,
    },
    { type: "h2", text: "Related Ranburg Tools" },
    {
      type: "p",
      text: `Explore ${secondaryTools.length > 0 ? `companion tools including ${secondaryTools.map(toolLabel).join(", ")}` : "more utilities in the same category"} on Ranburg.com. Visit /tools for the full library of calculators, formatters, generators, and social analytics utilities.`,
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: `${topic.title.replace(/\?$/, "")} becomes straightforward when you combine solid fundamentals with the right free tool. Use Ranburg's ${toolLabel(primaryTool)} for ${topic.keyword}, iterate on your inputs, and return to this article whenever you need a refresher. For more guides in the ${topic.cluster} cluster, browse the Ranburg blog.`,
    },
  ];

  const faq: BlogFaq[] = topic.faq ?? [
    {
      question: `Is Ranburg's ${toolLabel(primaryTool)} free?`,
      answer: "Yes. All Ranburg tools are free to use in your browser with no account required.",
    },
    {
      question: `Is my data stored when I use ${toolLabel(primaryTool)}?`,
      answer: "Most tools process data locally in your browser. Social and currency tools may call external APIs to fetch public or live data.",
    },
    {
      question: `How accurate are results for ${topic.keyword}?`,
      answer: topic.faqAccuracy,
    },
    {
      question: "Can I use these tools on mobile?",
      answer: "Yes. Ranburg tools are responsive and work on phones, tablets, and desktops.",
    },
  ];

  const baseDate = new Date("2026-01-10T12:00:00Z");
  baseDate.setDate(baseDate.getDate() + dateIndex * 2);
  const date = baseDate.toISOString().split("T")[0];

  return {
    slug: topic.slug,
    title: topic.title,
    excerpt: topic.excerpt,
    date,
    readTime: readTimeFromSections(sections),
    category: topic.category,
    featuredToolSlug: primaryTool,
    seo: {
      title: `${topic.title} | Ranburg.com`,
      description: topic.excerpt,
      keywords: [topic.keyword, ...topic.tools.map(toolLabel), "Ranburg", "free online tools"],
    },
    sections,
    faq,
    relatedServices: [],
    relatedTools: topic.tools,
  };
}
