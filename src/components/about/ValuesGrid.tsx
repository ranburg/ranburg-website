import type { CSSProperties } from "react";
import { Lightbulb, Shield, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We push boundaries with cutting-edge technologies and creative problem-solving to deliver solutions that set you apart.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "hover:border-yellow-400/40",
  },
  {
    icon: Shield,
    title: "Reliability",
    description:
      "Enterprise-grade quality, rigorous testing, and dependable support ensure your systems perform when it matters most.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "hover:border-accent/40",
  },
  {
    icon: TrendingUp,
    title: "Scalability",
    description:
      "Architectures designed to grow with your business — from startup MVP to enterprise-scale deployments.",
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
    border: "hover:border-accent-emerald/40",
  },
];

export default function ValuesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {values.map((value, i) => {
        const Icon = value.icon;
        return (
          <div
            key={value.title}
            data-reveal="up"
            style={{ "--reveal-delay": `${i * 100}ms` } as CSSProperties}
            className={`card spotlight group cursor-default p-6 transition-colors duration-500 sm:p-8 ${value.border}`}
          >
            <div
              className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${value.bg} transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110`}
            >
              <Icon className={`h-7 w-7 ${value.color}`} />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-theme-heading sm:text-2xl">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-theme-muted sm:text-base">{value.description}</p>
          </div>
        );
      })}
    </div>
  );
}
