import { cn } from "@/utils/cn";
import * as SeparatorPrimitives from "@radix-ui/react-separator";

export const Separator = ({ className }: { className: string }) => (
  <SeparatorPrimitives.Root
    className={cn("bg-brand-navy-light-accent-light", className)}
  />
);
