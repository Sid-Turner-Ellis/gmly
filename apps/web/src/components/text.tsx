import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes, ReactNode, forwardRef, useMemo, useRef } from "react";
import { Skeleton } from "./skeleton";

export const textVariantClassnames = {
  p: "text-sm text-brand-gray font-inter",
  label: "text-sm text-brand-white font-inter font-semibold",
};

type TextProps = {
  variant?: keyof typeof textVariantClassnames;
} & {
  className?: ClassValue;
  children: ReactNode;
} & HTMLAttributes<HTMLParagraphElement>;

export const TextSkeleton = ({ className }: { className?: ClassValue }) => {
  return <Skeleton className={cn("h-3.5", className)} />;
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ variant = "p", className, children, ...attributes }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(textVariantClassnames[variant], className)}
        {...attributes}
      >
        {children}
      </p>
    );
  }
);

Text.displayName = "Text";
