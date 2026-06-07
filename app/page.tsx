import { HeroSection } from "@/components/sections/HeroSection";
import { PainTicker } from "@/components/sections/PainTicker";
import TheProblemSection from "@/components/sections/TheProblemSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { AiSection } from "@/components/sections/AiSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

import FlowArt, { FlowSection } from "@/components/ui/story-scroll";

export default function LandingPage() {
  return (
    <FlowArt>
      <FlowSection className="bg-[#0A0A0A]"><HeroSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><PainTicker /><TheProblemSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><FeaturesSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><AiSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><HowItWorksSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><PricingSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><TestimonialsSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><AboutSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><FaqSection /></FlowSection>
      <FlowSection className="bg-[#0A0A0A]"><CtaBanner /></FlowSection>
    </FlowArt>
  );
}
