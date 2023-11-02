// const variant

import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, useMemo, useRef } from "react";

const variants = {
  p: "text-xl",
};

type TextProps = {
  variant?: keyof typeof variants;
} & { className?: ClassValue; children: ReactNode };

export const Text = ({ variant = "p", children, className }: TextProps) => {
  return (
    <p className={cn("text-text", variants[variant], className)}>{children}</p>
  );
};
