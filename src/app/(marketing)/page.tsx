import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <BenefitsSection />
      <CTASection />
    </>
  );
}
