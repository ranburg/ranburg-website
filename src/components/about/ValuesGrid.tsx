"use client";

import { motion } from "framer-motion";
import { Lightbulb, Shield, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We push boundaries with cutting-edge technologies and creative problem-solving to deliver solutions that set you apart.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "group-hover:border-yellow-400/30",
  },
  {
    icon: Shield,
    title: "Reliability",
    description:
      "Enterprise-grade quality, rigorous testing, and dependable support ensure your systems perform when it matters most.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "group-hover:border-accent/30",
  },
  {
    icon: TrendingUp,
    title: "Scalability",
    description:
      "Architectures designed to grow with your business — from startup MVP to enterprise-scale deployments.",
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
    border: "group-hover:border-accent-emerald/30",
  },
];

export default function ValuesGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {values.map((value, i) => {
        const Icon = value.icon;
        return (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card group cursor-default p-8 transition-all ${value.border}`}
          >
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${value.bg} transition-transform group-hover:scale-110`}
            >
              <Icon className={`h-7 w-7 ${value.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {value.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
