// const variant

import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, useMemo, useRef } from "react";

export const textVariantClassnames = {
  p: "text-lg text-brand-gray",
};

type TextProps = {
  variant?: keyof typeof textVariantClassnames;
} & { className?: ClassValue; children: ReactNode };

export const Text = ({ variant = "p", children, className }: TextProps) => {
  return (
    <p
      className={cn(
        "text-brand-gray",
        textVariantClassnames[variant],
        className
      )}
    >
      {children}
    </p>
  );
};
