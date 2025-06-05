// components/PredictionsSection.tsx
"use client"; // KEEP THIS AS THE FIRST LINE

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Import Link for navigation

interface PredictionsSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string; // The text for the button
  detailsPageUrl?: string; // NEW: Optional URL for the details page
}

const PredictionsSection: React.FC<PredictionsSectionProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  detailsPageUrl, // Use the new prop
}) => {
  // If `detailsPageUrl` is provided, the button will be a Link.
  // Otherwise, it will be a regular button, and you can define
  // a local handler if needed (e.g., for a modal that opens here).
  const handleInternalClick = () => {
    console.log("Button clicked inside PredictionsSection (no external URL).");
    // You could open a modal here, or trigger other client-side logic.
  };

  return (
    <>
      <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Predictions
      </h2>
      <div className="p-4">
        <div className="flex items-stretch justify-between gap-4 rounded-xl">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[#131811] text-base font-bold leading-tight">
                {title}
              </p>
              <p className="text-[#6c8560] text-sm font-normal leading-normal">
                {description}
              </p>
            </div>
            {/* Conditional rendering based on whether a URL is provided */}
            {detailsPageUrl ? (
              <Link href={detailsPageUrl} passHref>
                {/* As per Shadcn UI docs, use asChild with Link to pass ref to Button */}
                <Button
                  asChild
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#ecf0ea] text-[#131811] text-sm font-medium leading-normal w-fit"
                >
                  <span className="truncate">{buttonText}</span>
                </Button>
              </Link>
            ) : (
              <Button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#ecf0ea] text-[#131811] text-sm font-medium leading-normal w-fit"
                onClick={handleInternalClick} // Handles clicks internally
              >
                <span className="truncate">{buttonText}</span>
              </Button>
            )}
          </div>
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default PredictionsSection;
