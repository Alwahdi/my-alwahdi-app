// src/components/KeyFeaturesSection.tsx
import { Button } from "@/components/ui/button";
import { Search, LineChart, Map } from "lucide-react"; // Import icons from Lucide React

// Define a type for your feature data for better type safety and reusability
interface Feature {
  icon: React.ElementType; // Represents a React component for the icon
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Search,
    title: "Comprehensive Analysis",
    description:
      "Gain deep insights into groundwater resources with detailed analysis of various parameters.",
  },
  {
    icon: LineChart,
    title: "Predictive Modeling",
    description:
      "Forecast future groundwater levels and trends with our advanced predictive models.",
  },
  {
    icon: Map,
    title: "Interactive Mapping",
    description:
      "Visualize groundwater data and analysis results on interactive maps for better understanding.",
  },
];

export function KeyFeaturesSection() {
  return (
    <div className="flex flex-col gap-10 px-4 py-10 @container">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-[#131810] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
            Key Features
          </h1>
          <p className="text-[#131810] text-base font-normal leading-normal max-w-[720px]">
            Explore the powerful capabilities of Alwahdi for groundwater
            analysis and management.
          </p>
        </div>
        {/* Use Shadcn Button */}
        <Button className="bg-[#539932] text-[#fafbf9] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit h-10 px-4 @[480px]:h-12 @[480px]:px-5 hover:bg-[#4a8a2b]">
          Learn More
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-1 gap-3 rounded-lg border border-[#d9e2d4] bg-[#fafbf9] p-4 flex-col"
          >
            <div className="text-[#131810]">
              {/* Render the icon component */}
              <feature.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#131810] text-base font-bold leading-tight">
                {feature.title}
              </h2>
              <p className="text-[#6a8a5c] text-sm font-normal leading-normal">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
