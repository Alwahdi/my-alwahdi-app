// components/InteractiveMap.tsx
import React from "react";

interface InteractiveMapProps {
  mapImageUrl: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ mapImageUrl }) => {
  return (
    <>
      <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Interactive Map
      </h2>
      <div className="flex px-4 py-3">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover"
          style={{ backgroundImage: `url("${mapImageUrl}")` }}
        ></div>
      </div>
    </>
  );
};

export default InteractiveMap;
