import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes, ReactNode, forwardRef, useMemo, useRef } from "react";
import { Skeleton } from "./skeleton";

export const textVariantClassnames = {
  p: "text-sm text-brand-gray",
  label: "text-sm text-brand-white font-semibold",
};

type TextProps = {
  variant?: keyof typeof textVariantClassnames;
} & {
  className?: ClassValue;
  skeleton?: {
    isLoading: boolean;
    numberOfLines?: number;
    className?: ClassValue;
  };
  children: ReactNode;
} & HTMLAttributes<HTMLParagraphElement>;

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ variant = "p", className, children, skeleton, ...attributes }, ref) => {
    const resolvedSkeleton = {
      isLoading: skeleton?.isLoading ?? false,
      numberOfLines: skeleton?.numberOfLines ?? 1,
      className: skeleton?.className ?? "",
    };

    if (resolvedSkeleton.isLoading) {
      return (
        <div>
          {Array.from({ length: resolvedSkeleton.numberOfLines }).map(
            (_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  "h-3 w-full inline-block",
                  resolvedSkeleton.numberOfLines > 0 && "mb-2 block",
                  className,
                  resolvedSkeleton.className
                )}
              />
            )
          )}
        </div>
      );
    }
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
