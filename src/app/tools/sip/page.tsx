import type { Metadata } from "next";
import Link from "next/link";
import SIPCalculator from "@/components/tools/SIPCalculator";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Calculate your Systematic Investment Plan returns with Ranburg's free SIP calculator.",
};

export default function SIPPage() {
  return (
    <div className="pb-24">
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/tools"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            SIP <span className="text-gradient-accent">Calculator</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Estimate the future value of your monthly investments with compound returns.
            Adjust sliders for instant results.
          </p>
        </div>
      </section>
      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SIPCalculator />
        </div>
      </section>
    </div>
  );
}
