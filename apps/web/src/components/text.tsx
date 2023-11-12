import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes, ReactNode, forwardRef, useMemo, useRef } from "react";

export const textVariantClassnames = {
  p: "text-md text-brand-gray",
  label: "text-md text-brand-white font-bold",
};

type TextProps = {
  variant?: keyof typeof textVariantClassnames;
} & {
  className?: ClassValue;
  children: ReactNode;
} & HTMLAttributes<HTMLParagraphElement>;

export const Text = forwardRef<HTMLHeadingElement, TextProps>(
  ({ variant = "p", className, children, ...attributes }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-brand-gray",
          textVariantClassnames[variant],
          className
        )}
        {...attributes}
      >
        {children}
      </p>
    );
  }
);

Text.displayName = "Text";
