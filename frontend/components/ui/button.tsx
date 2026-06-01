"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7DF3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-95 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#4F7DF3] text-white hover:bg-[#3563D8] shadow-sm shadow-[#4F7DF3]/20 hover:shadow-md hover:shadow-[#4F7DF3]/25",
        accent:
          "bg-[#6EC6CA] text-white hover:bg-[#5AB5B9] shadow-sm shadow-[#6EC6CA]/20",
        ghost:
          "text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937]",
        outline:
          "border border-[#E5E7EB] text-[#374151] bg-white hover:bg-gray-50 hover:border-[#D1D5DB]",
        destructive:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
        success:
          "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100",
        glass:
          "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-gray-50 shadow-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base rounded-xl",
        xl: "h-14 px-8 text-lg rounded-2xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
