import { cn } from "@/utils/cn";
import { Icon, IconType } from "../icon";
import { Text } from "../text";

export const SidebarButton = ({
  label,
  icon,
  isActive,
  buttonClassName,
  textClassName,
}: {
  label: string;
  icon: IconType;
  isActive?: boolean;
  buttonClassName?: string;
  textClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-5 p-2 transition cursor-pointer group rounded-lg border border-solid border-bg-light bg-bg-light",
        {
          "hover:border-white/20": !isActive,
          "bg-whiteAlpha-100": isActive,
        },
        buttonClassName
      )}
    >
      <Icon
        icon={icon}
        className={cn(
          {
            "text-icon-hover": isActive,
          },
          textClassName
        )}
      />
      <p className={cn("text-text text-md ", textClassName)}>{label}</p>
    </div>
  );
};
