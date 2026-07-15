import type { BlogPost } from "./blogTypes";
import type { ToolConfig } from "./toolsConfig";

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function generateToolGuideBlog(tool: ToolConfig, dateIndex: number): BlogPost {
  const category =
    tool.category === "salesforce"
      ? "salesforce"
      : tool.category === "developer"
        ? "development"
        : tool.category === "financial"
          ? "calculators"
          : "business-productivity";

  const sections = [
    { type: "h2" as const, text: `What is the ${tool.title}?` },
    {
      type: "p" as const,
      text: `${tool.shortDescription} The ${tool.title} on Ranburg.com is a free, browser-based utility — no signup, no install. This guide explains how to use it effectively and when to reach for it in your daily workflow.`,
    },
    {
      type: "p" as const,
      text: tool.seo.description,
    },
    { type: "h2" as const, text: `Try the ${tool.title} Now` },
    {
      type: "p" as const,
      text: `Open the free ${tool.title} at ranburg.com/tools/${tool.slug}. Results update instantly as you change inputs. Bookmark the page for repeat use — it works on desktop and mobile browsers.`,
    },
    { type: "h2" as const, text: "How to Use It Step by Step" },
    ...tool.howToUse.flatMap((step, i) => [
      { type: "h3" as const, text: `Step ${i + 1}` },
      { type: "p" as const, text: step },
    ]),
    { type: "h2" as const, text: "How It Works" },
    {
      type: "p" as const,
      text: tool.formula,
    },
    { type: "h2" as const, text: "Tips for Best Results" },
    {
      type: "p" as const,
      text: `Use the ${tool.title} for quick, repeatable tasks rather than one-off guesses. Compare multiple scenarios by adjusting inputs, export or copy results, and pair this tool with related utilities listed on the tool page. For production or compliance decisions, validate outputs with official sources or qualified professionals.`,
    },
    { type: "h2" as const, text: "Conclusion" },
    {
      type: "p" as const,
      text: `The ${tool.title} is part of Ranburg.com's free tools library. Use this guide as a reference, then head to /tools/${tool.slug} whenever you need ${tool.badge.toLowerCase()} workflows done fast.`,
    },
  ];

  const words = sections.reduce((n, s) => n + wordCount(s.text), 0);
  const baseDate = new Date("2026-06-01T12:00:00Z");
  baseDate.setDate(baseDate.getDate() + dateIndex);

  return {
    slug: `${tool.slug}-guide`,
    title: `How to Use ${tool.title} — Free Online Guide`,
    excerpt: `Complete guide to Ranburg's free ${tool.title}. ${tool.shortDescription}`,
    date: baseDate.toISOString().split("T")[0],
    readTime: `${Math.max(5, Math.ceil(words / 200))} min`,
    category,
    featuredToolSlug: tool.slug,
    seo: {
      title: `How to Use ${tool.title} — Free Guide | Ranburg.com`,
      description: `Learn how to use the free ${tool.title} on Ranburg.com. ${tool.shortDescription}`,
      keywords: [...tool.seo.keywords, tool.title, "Ranburg", "free online tool guide"],
    },
    sections,
    faq: tool.faq.slice(0, 5),
    relatedServices: [],
    relatedTools: [tool.slug],
  };
}
