// components/PredictionsSection.tsx
import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn ui button component

interface PredictionsSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  onButtonClick: () => void; // Optional: for handling button clicks
}

const PredictionsSection: React.FC<PredictionsSectionProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
}) => {
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
            <Button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#ecf0ea] text-[#131811] text-sm font-medium leading-normal w-fit"
              onClick={onButtonClick}
            >
              <span className="truncate">{buttonText}</span>
            </Button>
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
