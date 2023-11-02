import { ClassValue } from "clsx";
import { ReactNode } from "react";
import { Icon, IconType } from "./icon";
import { cn } from "@/utils/cn";
import { Text } from "./text";

type ButtonProps = {
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
  className?: ClassValue;
  icon?: IconType;
  title?: string;
  onClick?: () => void;
};

export const Button = ({
  className,
  isDisabled,
  onClick,
  icon,
  variant,
  title,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "h-fit group disabled:pointer-events-none rounded py-2 px-4 inline-flex border-2 transition-all justify-center items-center gap-3 disabled:opacity-70",
        {
          "bg-primary text-white hover:bg-primary-dark border-primary hover:border-primary-dark active:border-primary":
            !variant || variant === "primary",
          "bg-bg-light text-text hover:text-white border-bg-light  active:border-bg":
            variant === "secondary",
        },
        className
      )}
    >
      {icon && (
        <Icon
          size={20}
          icon={icon}
          className={cn({
            "text-icon-hover": variant === "primary",
          })}
        />
      )}
      {title && <p>{title}</p>}
    </button>
  );
};
