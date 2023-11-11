// const variant

import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, useMemo, useRef } from "react";

const variants = {
  h1: "text-4xl font-bold text-brand-white mb-12",
  h2: "text-3xl font-bold text-brand-white",
  h3: "text-2xl font-bold text-brand-white mb-5",
};

type HeadingProps = {
  variant: keyof typeof variants;
} & { className?: ClassValue; children: ReactNode };

export const Heading = ({ variant, children, className }: HeadingProps) => {
  const Tag = useMemo(() => variant, [variant]);

  return <Tag className={cn(variants[variant], className)}>{children}</Tag>;
};
