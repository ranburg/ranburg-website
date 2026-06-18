"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, Calculator, ArrowRight } from "lucide-react";

const tools = [
  {
    href: "/tools/sip",
    icon: TrendingUp,
    title: "SIP Calculator",
    description:
      "Plan your Systematic Investment Plan. Calculate returns on monthly mutual fund investments over time.",
    gradient: "from-blue-500 to-cyan-500",
    stats: "Wealth Builder",
  },
  {
    href: "/tools/swp",
    icon: Wallet,
    title: "SWP Calculator",
    description:
      "Model your Systematic Withdrawal Plan. See how long your corpus lasts with regular monthly withdrawals.",
    gradient: "from-emerald-500 to-teal-500",
    stats: "Retirement Income",
  },
  {
    href: "/tools/emi",
    icon: Calculator,
    title: "Loan EMI Calculator",
    description:
      "Calculate monthly EMI, total interest, and payment breakdown for home, car, or personal loans.",
    gradient: "from-amber-500 to-orange-500",
    stats: "Loan Planner",
  },
];

export default function ToolsHub() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={tool.href} className="group block">
              <div className="glass-card relative h-full overflow-hidden p-8 transition-all group-hover:border-accent/30">
                <div
                  className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`}
                />
                <div className="relative">
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {tool.stats}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white group-hover:text-accent transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                    Open Calculator
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
