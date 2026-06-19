"use client";

import { useMemo, useState } from "react";
import CalculatorSlider from "@/components/ui/CalculatorSlider";
import ResultCard from "@/components/tools/ResultCard";

export default function RevenueCloudPricingCalculator() {
  const [listPrice, setListPrice] = useState(10000);
  const [quantity, setQuantity] = useState(10);
  const [discount, setDiscount] = useState(15);
  const [partnerMargin, setPartnerMargin] = useState(0);

  const results = useMemo(() => {
    const unitNet = listPrice * (1 - discount / 100) * (1 - partnerMargin / 100);
    const total = unitNet * quantity;
    const arr = total * 12;
    return { unitNet, total, arr };
  }, [listPrice, quantity, discount, partnerMargin]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="glass-card space-y-6 p-8">
        <CalculatorSlider label="List Price (₹)" value={listPrice} min={100} max={1000000} step={100} prefix="₹" onChange={setListPrice} />
        <CalculatorSlider label="Quantity" value={quantity} min={1} max={1000} step={1} onChange={setQuantity} />
        <CalculatorSlider label="Discount" value={discount} min={0} max={50} step={1} unit="%" onChange={setDiscount} />
        <CalculatorSlider label="Partner Margin" value={partnerMargin} min={0} max={30} step={1} unit="%" onChange={setPartnerMargin} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard label="Net Unit Price" value={results.unitNet} variant="blue" />
        <ResultCard label="Total Contract Value" value={results.total} highlight />
        <ResultCard label="Est. Annual (×12)" value={results.arr} variant="emerald" />
      </div>
    </div>
  );
}
