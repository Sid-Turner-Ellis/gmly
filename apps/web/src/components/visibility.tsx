import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

type VisibilityProps = {
  children: ReactNode;
  className?: ClassValue;
} & ({ show: true } | { hide: true }) &
  (
    | {
        above: Breakpoint;
      }
    | { below: Breakpoint }
  );

export const Visibility = ({
  children,
  className,
  ...rest
}: VisibilityProps) => {
  const isShow = "show" in rest;
  const isAboveType = "above" in rest;
  const bpValue = isAboveType ? rest.above : rest.below;

  const classes = useMemo(
    () =>
      isShow
        ? `${isAboveType ? "hidden" : "block"} ${bpValue}:${
            isAboveType ? "block" : "hidden"
          }`
        : `${isAboveType ? "block" : "hidden"} ${bpValue}:${
            isAboveType ? "hidden" : "block"
          }`,
    [bpValue, isShow, isAboveType]
  );

  return <div className={cn(classes, className)}>{children}</div>;
};
