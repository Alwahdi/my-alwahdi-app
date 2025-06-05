"use client";

import { Button } from "@/components/ui/button";
import { Search, LineChart, Map } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface Feature {
  icon: React.ElementType;
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
    <section className="flex flex-col gap-10 px-4 py-10 @container">
      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-[#131810] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
            Key Features
          </h1>
          <p className="text-[#131810] text-base font-normal leading-normal max-w-[720px]">
            Explore the powerful capabilities of Alwahdi for groundwater
            analysis and management.
          </p>
        </div>

        <Button className="bg-[#539932] text-[#fafbf9] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit h-10 px-4 @[480px]:h-12 @[480px]:px-5 hover:bg-[#4a8a2b] transition-colors duration-200 ease-in-out active:scale-95">
          Learn More
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="flex flex-col gap-3 p-5 rounded-lg border border-[#d9e2d4] bg-[#fafbf9] shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out cursor-pointer"
            >
              <div className="text-[#131810]">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#131810] text-base font-bold leading-tight">
                  {feature.title}
                </h2>
                <p className="text-[#6a8a5c] text-sm font-normal leading-normal">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
