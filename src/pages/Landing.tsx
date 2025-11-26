import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";
import { NeonBackground } from "@/components/landing/NeonBackground";

const Landing = () => {
  return (
    <div className="min-h-screen relative">
      <NeonBackground />
      <div className="relative z-10">
        <LandingHeader />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
