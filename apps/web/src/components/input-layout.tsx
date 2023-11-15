import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { Icon, IconType } from "./icon";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { textVariantClassnames } from "./text";

type InputLayoutProps = {
  icon?: IconType;
  error?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: ClassValue;
} & HTMLAttributes<HTMLDivElement>;

export const InputLayout = forwardRef<HTMLDivElement, InputLayoutProps>(
  ({ icon, error, children, disabled, className, ...props }, ref) => {
    return (
      <>
        <div
          {...props}
          ref={ref}
          className={cn(
            "flex transition-all h-12 items-center bg-brand-navy-light border-2 gap-4 border-brand-navy-light focus-within:border-black flex-nowrap rounded overflow-hidden text-brand-gray",
            error &&
              "border-brand-status-error focus-within:border-brand-status-error",
            disabled && "opacity-70 pointer-events-none",
            className
          )}
        >
          {icon && <Icon icon={icon} size={20} className="pl-4" />}
          <div
            className={cn(
              textVariantClassnames.p,
              "placeholder:text-brand-gray w-full min-h-full max-h-full h-full focus:bg-red-600 pr-4 [&>*]:py-2"
            )}
          >
            {children}
          </div>
        </div>
        {error && !disabled && (
          <span className="block mt-2 text-brand-status-error">{error}</span>
        )}
      </>
    );
  }
);

InputLayout.displayName = "InputLayout";
