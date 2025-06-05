"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react"; // Using Lucide's Check icon as base, though we'll use CSS for the tick

import { cn } from "@/lib/utils"; // For combining Tailwind classes

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border-2 border-[#d9e2d4] bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[#539932] data-[state=checked]:border-[#539932]",
      // Custom tick mark using the CSS variable defined in globals.css
      "data-[state=checked]:bg-[image:var(--checkbox-tick-svg)] data-[state=checked]:bg-center data-[state=checked]:bg-no-repeat",
      className
    )}
    {...props}
  >
    {/* We don't need the Check icon here if we're using a background image for the tick */}
    {/* <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator> */}
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

interface CheckboxWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  label: string;
}

export function CheckboxWithLabel({
  label,
  id,
  ...props
}: CheckboxWithLabelProps) {
  const generatedId = React.useId(); // Unique ID for accessibility
  const uniqueId = id || generatedId;

  return (
    <div className="flex gap-x-3 py-3 flex-row items-center">
      <Checkbox id={uniqueId} {...props} />
      <label
        htmlFor={uniqueId}
        className="text-[#131810] text-base font-normal leading-normal cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
