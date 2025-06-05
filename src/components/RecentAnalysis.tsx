// components/RecentAnalysis.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have shadcn ui card component

// Placeholder for the chart data (replace with actual data in a real app)
const groundwaterTrendData = {
  value: "-0.3m",
  period: "Last 12 Months",
  change: "-2%",
  changeColor: "text-[#e71f08]", // Red color for negative change
  chartSvg: (
    <svg
      width="100%"
      height="148"
      viewBox="-3 0 478 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
        fill="url(#paint0_linear_1131_5935)"
      ></path>
      <path
        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
        stroke="#6c8560"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_1131_5935"
          x1="236"
          y1="1"
          x2="236"
          y2="149"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ecf0ea"></stop>
          <stop offset="1" stopColor="#ecf0ea" stopOpacity="0"></stop>
        </linearGradient>
      </defs>
    </svg>
  ),
  chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
};

const rainfallCorrelationData = {
  value: "Correlation: 0.75",
  period: "Last 6 Months",
  change: "+5%",
  changeColor: "text-[#07881f]", // Green color for positive change
  barChartData: [
    { label: "Jan", height: "60%" },
    { label: "Feb", height: "20%" },
    { label: "Mar", height: "70%" },
    { label: "Apr", height: "50%" },
    { label: "May", height: "80%" },
    { label: "Jun", height: "10%" },
  ],
};

const RecentAnalysis: React.FC = () => {
  return (
    <>
      <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Recent Analysis
      </h2>
      <div className="flex flex-wrap gap-4 px-4 py-6">
        {/* Groundwater Level Trend Card */}
        <Card className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#d9e1d6] p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-[#131811] text-base font-medium leading-normal">
              Groundwater Level Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-2">
            <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight truncate">
              {groundwaterTrendData.value}
            </p>
            <div className="flex gap-1">
              <p className="text-[#6c8560] text-base font-normal leading-normal">
                {groundwaterTrendData.period}
              </p>
              <p
                className={`${groundwaterTrendData.changeColor} text-base font-medium leading-normal`}
              >
                {groundwaterTrendData.change}
              </p>
            </div>
            <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
              {groundwaterTrendData.chartSvg}
              <div className="flex justify-around">
                {groundwaterTrendData.chartLabels.map((label, index) => (
                  <p
                    key={index}
                    className="text-[#6c8560] text-[13px] font-bold leading-normal tracking-[0.015em]"
                  >
                    {label}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rainfall vs. Groundwater Level Card */}
        <Card className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#d9e1d6] p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-[#131811] text-base font-medium leading-normal">
              Rainfall vs. Groundwater Level
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-2">
            <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight truncate">
              {rainfallCorrelationData.value}
            </p>
            <div className="flex gap-1">
              <p className="text-[#6c8560] text-base font-normal leading-normal">
                {rainfallCorrelationData.period}
              </p>
              <p
                className={`${rainfallCorrelationData.changeColor} text-base font-medium leading-normal`}
              >
                {rainfallCorrelationData.change}
              </p>
            </div>
            <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
              {rainfallCorrelationData.barChartData.map((bar, index) => (
                <React.Fragment key={index}>
                  <div
                    className="border-[#6c8560] bg-[#ecf0ea] border-t-2 w-full"
                    style={{ height: bar.height }}
                  ></div>
                  <p className="text-[#6c8560] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    {bar.label}
                  </p>
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RecentAnalysis;
