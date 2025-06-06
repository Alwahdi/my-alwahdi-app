"use client"; // Important for using client-side features like hover effects

import React from "react";

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  changePositive?: boolean;
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changePositive = true,
}) => {
  return (
    <div
      className="
        bg-[#ecf0ea] 
        rounded-xl 
        p-6 
        flex 
        flex-col 
        gap-2
        shadow-sm           /* subtle initial shadow */
        transform            /* enable transform utilities */
        transition-all       /* animate all transitions */
        duration-300         /* duration for transition */
        ease-in-out          /* easing function */
        hover:scale-[1.02]   /* slightly increase size on hover */
        hover:shadow-md      /* increase shadow on hover */
        cursor-pointer       /* indicate interactivity */
      "
    >
      <p className="text-[#131811] text-base font-medium">{title}</p>
      <p className="text-[#131811] text-2xl md:text-3xl font-bold leading-tight">
        {value}
      </p>
      <p
        className={`${
          changePositive ? "text-[#07881f]" : "text-[#e71f08]"
        } text-base font-medium`}
      >
        {change}
      </p>
    </div>
  );
};

const Overview: React.FC = () => {
  return (
    <section className="p-4 sm:p-6 lg:p-8">
      {" "}
      {/* Adjusted padding for responsiveness */}
      <div className="flex flex-col gap-2 mb-6 text-center sm:text-left">
        {" "}
        {/* Centered text on small screens */}
        <h1 className="text-[#131811] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
          Groundwater Analysis Overview
        </h1>
        <p className="text-[#6c8560] text-sm sm:text-base font-normal">
          Key metrics and predictions for informed decision-making.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Metric Card 1 */}
        <MetricCard
          title="Current Groundwater Level"
          value="15.2m"
          change="-3%"
          changePositive={false}
        />
        {/* Metric Card 2 */}
        <MetricCard
          title="Predicted Change (Next 3 Months)"
          value="-0.5m"
          change="+2%"
          changePositive={true}
        />
        {/* Metric Card 3 */}
        <MetricCard
          title="Overall Health Score"
          value="78/100"
          change="+1%"
          changePositive={true}
        />
        {/* Optional: Add more cards to demonstrate responsiveness */}
      </div>
    </section>
  );
};

export default Overview;
