// src/app/page.tsx
// This is a Server Component by default in the App Router

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { KeyFeaturesSection } from "@/components/KeyFeaturesSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        {/* Main content area, apply padding directly here or in child components */}
        <div className="px-40 flex flex-1 justify-center py-5 max-sm:px-4">
          {" "}
          {/* Added max-sm:px-4 for small screen responsiveness */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <HeroSection />
            <KeyFeaturesSection />
            <BenefitsSection />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
