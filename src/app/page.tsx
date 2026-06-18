import Hero from "@/components/home/Hero";
import TrustTicker from "@/components/home/TrustTicker";
import ServicesPreview, { CTASection } from "@/components/home/ServicesPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustTicker />
      <ServicesPreview />
      <CTASection />
    </>
  );
}
