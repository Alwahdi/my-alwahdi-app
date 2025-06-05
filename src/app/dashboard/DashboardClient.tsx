"use client";

import AiChat from "@/components/AiChat";
import Overview from "@/components/OverView";
import RecentAnalysis from "@/components/RecentAnalysis";
import PredictionsSection from "@/components/PredictionsSection";
import dynamic from "next/dynamic";

// استيراد InteractiveMap ديناميكياً مع تعطيل SSR
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
});

export default function DashboardClient() {
  const predictionData = {
    title: "Groundwater Level Prediction",
    description:
      "AI predicts a slight decrease in groundwater levels over the next three months, influenced by seasonal changes and rainfall patterns.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsZl1_4ASObsb3XCE26dgyqW_HEGbkao-7wnrC1EbIbapmiZjjjL9z55dZJRRxRZaEvVlRl9UoXfdypKgiXBtspnUcDwa4MrScYCgZ4cJvnB-aqxN7KNjGtrdVaPJFAXEeEx9A7ljnZyJ0M36VYAflqiog3lqfxoP6zeRI0wvzdjuLBbBWQrHY-8b8gD2GakGF6xAbBhjpCZQXXpJEKp00OOnoe09v16DGvUzaYqA7rwGt_JH6auHDktO77G2kFLxZHDCTXdYftmMR",
    detailsPageUrl: "/some-details-page",
  };

  const mapData = {
    mapImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5IxigDleqsUIGXh_aAoMpqK7kD8kxQjsddp3XJCHnLFnXXomkxlk81mxs8vX6_-U0JYcOvL9kt24x8PEGHbPjki72E0QsviibPx8cyaMGrYjqs1mmcyQlC5y0W5-nY-Pyjds0dHsesf_P1r8VL5K5tmnW_SZ5AGauH2O_k2TO_Tc1VmhIFZXp6gAv7M7--TBEmAmB0jWPvhbguqiIbbP7bATmLSFAUoPA-yN5Hu4dH4fha-QPUzgpGakNUlNhSqm3vl-QOMoWbDrV",
  };

  return (
    <>
      <Overview />
      <AiChat />
      <RecentAnalysis />
      <PredictionsSection
        title={predictionData.title}
        description={predictionData.description}
        imageUrl={predictionData.imageUrl}
        buttonText="View Details"
        detailsPageUrl={predictionData.detailsPageUrl}
      />
      <InteractiveMap />
    </>
  );
}
