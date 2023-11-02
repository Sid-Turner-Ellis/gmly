// const variant

import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, useMemo, useRef } from "react";

const variants = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
};

type HeadingProps = {
  variant: keyof typeof variants;
} & { className?: ClassValue; children: ReactNode };

export const Heading = ({ variant, children, className }: HeadingProps) => {
  const Tag = useMemo(() => variant, [variant]);

  return <Tag className={cn(variants[variant], className)}>{children}</Tag>;
};
