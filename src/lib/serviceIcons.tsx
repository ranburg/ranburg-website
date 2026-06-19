import {
  Cloud,
  Code2,
  Layers,
  DollarSign,
  Building2,
  Globe,
  Zap,
  Link2,
  Headphones,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Cloud,
  Code2,
  Layers,
  DollarSign,
  Building2,
  Globe,
  Zap,
  Link2,
  Headphones,
  Users,
};

export function getServiceIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Wrench;
}
