"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackCopyOutput } from "@/lib/ga";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  toolSlug?: string;
}

export default function CopyButton({ text, label = "Copy", className, toolSlug }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackCopyOutput(toolSlug);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        copied
          ? "bg-accent-emerald/20 text-accent-emerald"
          : "bg-accent/10 text-accent hover:bg-accent/20",
        !text && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
