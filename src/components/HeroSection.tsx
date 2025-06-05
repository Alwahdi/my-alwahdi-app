import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function HeroSection() {
  return (
    // Corresponds to the div with @container
    <div className="@container">
      {/* Corresponds to the div with @[480px]:p-4 */}
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwoZszfmEFecr09EfeMPwW3-kjYrnKrcGhvd4rj3slGPbC37u6NLBd08QHgOy9MbqE82GX29t154Bj-fjHXX4bWme-MHS1Qi8DnhxG1s_ThOF9As0io3dmVKTCxg5Z6PJBX5f1M_AgLQmXBiLkluxkUPzgVsWNuK4AomdivMJSKzMJU6ASwmT2ynmFcrmswVm3MzMrfhjncHeqxJNfBBZz378WSHADzLtsKl3lffcssP3MFoGFEHc1rN8LksjvRfeM1evqnCUnOH2Z")`,
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              AI-Powered Groundwater Analysis and Prediction
            </h1>
            <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              Alwahdi leverages advanced AI algorithms to provide accurate
              groundwater analysis and predictions, empowering sustainable water
              management.
            </h2>
          </div>
          <SignedIn>
            <Button className="bg-[#539932] text-[#fafbf9] text-sm font-bold leading-normal tracking-[0.015em] h-10 px-4 hover:bg-[#4a8a2b]">
              Dashboard
            </Button>
          </SignedIn>
          <SignedOut>
            <Button className="bg-[#539932] text-[#fafbf9] text-sm font-bold leading-normal tracking-[0.015em] h-10 px-4 hover:bg-[#4a8a2b]">
              <SignInButton />
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
