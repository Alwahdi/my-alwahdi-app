import { Input } from "@/components/ui/input";
import React from "react";
import { cn } from "@/lib/utils"; // Import cn for conditional class merging

interface SearchInputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  iconWrapperClassName?: string;
  inputClassName?: string;
  containerClassName?: string; // For the overall flex container
}

export function SearchInputWithIcon({
  icon,
  iconWrapperClassName,
  inputClassName,
  containerClassName,
  ...props
}: SearchInputWithIconProps) {
  return (
    <div className={cn("flex w-full items-stretch h-full", containerClassName)}>
      <div
        className={cn(
          "flex items-center justify-center pl-4",
          iconWrapperClassName,
          // Default styling for the icon wrapper
          "text-[#6a8a5c] bg-[#ecf1ea] rounded-l-lg border-r-0"
        )}
      >
        {icon}
      </div>
      <Input
        className={cn(
          "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#131810] focus:outline-0 focus:ring-0 border-none h-full placeholder:text-[#6a8a5c] px-4",
          inputClassName,
          // Default styling for the input
          "rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
        )}
        {...props}
      />
    </div>
  );
}
