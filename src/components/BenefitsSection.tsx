"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Benefit {
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXU4dPdvFbllITtGJmec71vg6kjfVtMNWQ-MYGh-Jv3UL81iU5cHoLzK0qhy6TvKKGhBn7ne9Motd9hPsEA4Hf9Y49mSiMN2whJSWujcEuI8K3AJSPbier-R0IQkP_W55eq7QtlPgOplexoi9pMXdbbapubcmYNG4UogreOF6py0FtpGzC5dqzQEDoP1xhHgMozoioE1spFeAKefqsFMWDlk1W2LMOMI0t0PzqAq2O66A9u2B9Knli8mR1qfFlpsUfnoKZW5XK1_Sh",
    altText: "Improved Decision-Making",
    title: "Improved Decision-Making",
    description:
      "Make informed decisions based on accurate groundwater analysis and predictions.",
  },
  {
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJsanbwFmQVcxA87blYss4NTb5LOpmLucy862ZvIWrQx4kJ5nOw29MwG8Xs3E6JGpZAsmrtikXnCdt5E97NNnIrQLks-iAE_nZjTWLy8K0kYk8DVCbkYMjt8dAPPoIrl9RiL-q4MF1M_WnFNc4KleBD8dS61r8aMeSAeBTm1nmKPRESojDohv8b50d8CAWBVoeYEGdg2IKlaH2LENjpnr_VHh-UaW6h1kuRQCnWd1Vot_QWvW5DdiT8Qn1IrHOM6S9hNJcfbN56ChF",
    altText: "Enhanced Resource Management",
    title: "Enhanced Resource Management",
    description:
      "Optimize groundwater resource allocation and utilization for long-term sustainability.",
  },
  {
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyK4K0_KR4K7bDJHOIT8GfTcfKPVviKV2BVjPvcdDR99qweTIjSXkIyXfWyQeXf5vp1XyQri78BNsRUhMZAP2hSbzbvHNPzJCQvE0ugHW9pm8fKzmGLAG9kfgRuExWoEB0uN6BJSrMhcEY_IOFIOyVBraleeV7opjaxmPkYrYcthtjV23n8aXlZUmAk2aDvwoUpPErTrbfemhyDUTryIJ3Y8uwJa0offh2w6FyHTGwSfFMCMp0H5OL_w2b0Rlof8r8fMmRgyLSptsY",
    altText: "Sustainable Practices",
    title: "Sustainable Practices",
    description:
      "Promote sustainable practices by understanding and managing groundwater resources effectively.",
  },
];

export function BenefitsSection() {
  return (
    <section className="flex flex-col gap-10 px-4 py-16 @container">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-[#131810] tracking-tight text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
          Benefits
        </h1>
        <p className="text-[#131810] text-base font-normal leading-normal max-w-[720px]">
          Discover how Alwahdi can help you achieve sustainable groundwater
          management.
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-4 pb-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Image
              src={benefit.imageUrl}
              alt={benefit.altText}
              width={300}
              height={168}
              className="w-full aspect-video object-cover rounded-t-lg"
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 300px"
              priority={index === 0} // Improve LCP on first image
            />
            <div className="px-4">
              <h3 className="text-[#131810] text-lg font-semibold leading-snug">
                {benefit.title}
              </h3>
              <p className="text-[#6a8a5c] text-sm font-normal leading-normal mt-1">
                {benefit.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
