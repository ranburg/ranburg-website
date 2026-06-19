import {
  TrendingUp,
  Wallet,
  Calculator,
  BarChart3,
  Tv,
  Braces,
  Database,
  FileCode,
  Linkedin,
  Type,
  AlignLeft,
  Sparkles,
  Image,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Wallet,
  Calculator,
  BarChart3,
  Tv,
  Braces,
  Database,
  FileCode,
  Linkedin,
  Type,
  AlignLeft,
  Sparkles,
  Image,
};

export function getToolIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Wrench;
}
