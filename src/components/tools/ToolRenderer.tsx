"use client";

import { notFound } from "next/navigation";
import { BASE_TOOL_COMPONENTS } from "./registry";
import { EXTENDED_TOOL_COMPONENTS } from "./extendedRegistry";

const ALL_TOOLS = { ...BASE_TOOL_COMPONENTS, ...EXTENDED_TOOL_COMPONENTS };

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = ALL_TOOLS[slug];
  if (!Tool) notFound();
  return <Tool />;
}
