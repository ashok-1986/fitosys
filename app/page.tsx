import { HeroSection } from "@/components/sections/HeroSection";
import { PainTicker } from "@/components/sections/PainTicker";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { WhatsAppSection } from "@/components/sections/WhatsAppSection";
import { AiSection } from "@/components/sections/AiSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <PainTicker />
      <ProblemSection />
      <FeaturesSection />
      <WhatsAppSection />
      <AiSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <AboutSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
