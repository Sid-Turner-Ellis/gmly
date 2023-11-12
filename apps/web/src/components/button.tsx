import { ClassValue } from "clsx";
import { ReactNode } from "react";
import { Icon, IconType } from "./icon";
import { cn } from "@/utils/cn";
import { Text } from "./text";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-3 border-2 border-transparent rounded transition",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-brand-white hover:bg-brand-primary-dark active:border-brand-primary",
        secondary:
          "bg-brand-navy-light text-brand-gray hover:text-white border-brand-navy-light active:border-brand-navy-accent-dark",
      },
      disabled: {
        true: "opacity-70 pointer-events-none",
        false: "",
      },

      size: {
        sm: "text-sm px-4 py-1",
        md: "text-base px-4 py-2 ",
        lg: "text-lg",
      },
    },
    // Purposefully empty so that by default we can extend with custom styles
    defaultVariants: {
      size: "md",
    },
    compoundVariants: [{}],
  }
);

// TODO: start accepting html attributes
type ButtonPropsnew = {
  className?: ClassValue;
  icon?: IconType | ReactNode;
  title?: string;
  onClick?: () => void;
} & VariantProps<typeof buttonVariants>;

export const Button = ({
  title,
  onClick,
  disabled,
  icon,
  variant,
  className,
  size,
}: ButtonPropsnew) => {
  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant, disabled, size }), className)}
    >
      {icon && typeof icon === "string" && (
        <Icon size={20} icon={icon as IconType} />
      )}
      {icon && typeof icon !== "string" && (
        <div className="w-[20px] h-[20px] max-w-[20px] max-h-[20px]">
          {icon}
        </div>
      )}
      {title && <p>{title}</p>}
    </button>
  );
};
