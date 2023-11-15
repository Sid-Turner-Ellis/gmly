import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes, ReactNode, forwardRef, useMemo, useRef } from "react";
import { Skeleton } from "./skeleton";
import { ConditionallyWrap } from "./conditionally-wrap";

const variants = {
  h1: "text-4xl font-bold text-brand-white mb-12",
  h2: "text-3xl font-bold text-brand-white",
  h3: "text-xl font-semibold text-brand-white mb-3",
};

type HeadingProps = {
  variant: keyof typeof variants;
} & {
  className?: ClassValue;
  skeletonClassName?: ClassValue;
  children?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
} & HTMLAttributes<HTMLHeadingElement>;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      variant,
      className,
      isLoading,
      skeletonClassName,
      children,
      ...attributes
    },
    ref
  ) => {
    const Tag = useMemo(() => variant, [variant]);

    if (isLoading) {
      return (
        <Skeleton
          className={cn(
            "h-12 w-full inline-block",
            className,
            skeletonClassName
          )}
        />
      );
    }

    return (
      <Tag
        ref={ref}
        className={cn(variants[variant], className)}
        {...attributes}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = "Heading";
