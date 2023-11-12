// const variant

import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { HTMLAttributes, ReactNode, forwardRef, useMemo, useRef } from "react";

const variants = {
  h1: "text-4xl font-bold text-brand-white mb-12",
  h2: "text-3xl font-bold text-brand-white",
  h3: "text-2xl font-bold text-brand-white mb-5",
};

type HeadingProps = {
  variant: keyof typeof variants;
} & {
  className?: ClassValue;
  children: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ variant, className, children, ...attributes }, ref) => {
    const Tag = useMemo(() => variant, [variant]);

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
