import type { Metadata } from "next";
import ToolsHub from "@/components/tools/ToolsHub";

export const metadata: Metadata = {
  title: "Financial Tools",
  description:
    "Free SIP, SWP, and EMI calculators by Ranburg.com. Plan investments, withdrawals, and loans with interactive charts.",
};

export default function ToolsPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Financial Tools Hub
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Smart <span className="text-gradient-accent">Calculators</span> for
              Smarter Decisions
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Free, interactive financial planning tools with real-time charts and
              instant results. Plan your investments, retirement income, and loan
              repayments with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolsHub />
        </div>
      </section>
    </div>
  );
}
