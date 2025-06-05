// app/dashboard/page.tsx
import AiChat from "@/components/AiChat";
import MainHeader from "@/components/MainHeader";
import Overview from "@/components/OverView"; // Corrected component name if it was typo
import RecentAnalysis from "@/components/RecentAnalysis";
import PredictionsSection from "@/components/PredictionsSection";
import InteractiveMap from "@/components/InteractiveMap";

export default function Dashboard() {
  // Placeholder data for the new sections
  const predictionData = {
    title: "Groundwater Level Prediction",
    description:
      "AI predicts a slight decrease in groundwater levels over the next three months, influenced by seasonal changes and rainfall patterns.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsZl1_4ASObsb3XCE26dgyqW_HEGbkao-7wnrC1EbIbapmiZjjjL9z55dZJRRxRZaEvVlRl9UoXfdypKgiXBtspnUcDwa4MrScYCgZ4cJvnB-aqxN7KNjGtrdVaPJFAXEeEx9A7ljnZyJ0M36VYAflqiog3lqfxoP6zeRI0wvzdjuLBbBWQrHY-8b8gD2GakGF6xAbBhjpCZQXXpJEKp00OOnoe09v16DGvUzaYqA7rwGt_JH6auHDktO77G2kFLxZHDCTXdYftmMR", // Replace with your actual image URL
    buttonText: "View Details",
    onViewDetails: () => {
      console.log("View Details clicked for Predictions");
      // Implement navigation or modal display here
    },
  };

  const mapData = {
    mapImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5IxigDleqsUIGXh_aAoMpqK7kD8kxQjsddp3XJCHnLFnXXomkxlk81mxs8vX6_-U0JYcOvL9kt24x8PEGHbPjki72E0QsviibPx8cyaMGrYjqs1mmcyQlC5y0W5-nY-Pyjds0dHsesf_P1r8VL5K5tmnW_SZ5AGauH2O_k2TO_Tc1VmhIFZXp6gAv7M7--TBEmAmB0jWPvhbguqiIbbP7bATmLSFAUoPA-yN5Hu4dH4fha-QPUzgpGakNUlNhSqm3vl-QOMoWbDrV", // Replace with your actual map image URL
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <MainHeader />
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <Overview />
            <AiChat />
            <RecentAnalysis />
            <PredictionsSection
              title={predictionData.title}
              description={predictionData.description}
              imageUrl={predictionData.imageUrl}
              buttonText={predictionData.buttonText}
              onButtonClick={predictionData.onViewDetails}
            />
            <InteractiveMap mapImageUrl={mapData.mapImageUrl} />
          </div>
        </main>
      </div>
    </div>
  );
}
