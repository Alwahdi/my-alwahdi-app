"use client";

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
    <div className="bg-[#ecf0ea] rounded-xl p-6 flex flex-col gap-2">
      <p className="text-[#131811] text-base font-medium">{title}</p>
      <p className="text-[#131811] text-2xl font-bold leading-tight">{value}</p>
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
    <section className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-[#131811] text-3xl font-bold leading-tight">
          Groundwater Analysis Overview
        </h1>
        <p className="text-[#6c8560] text-sm font-normal">
          Key metrics and predictions for informed decision-making.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Current Groundwater Level"
          value="15.2m"
          change="-3%"
          changePositive={false}
        />
        <MetricCard
          title="Predicted Change (Next 3 Months)"
          value="-0.5m"
          change="+2%"
          changePositive={true}
        />
        <MetricCard
          title="Overall Health Score"
          value="78/100"
          change="+1%"
          changePositive={true}
        />
      </div>
    </section>
  );
};

export default Overview;
