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
        "flex items-center gap-5 p-3 transition cursor-pointer group rounded-lg border border-solid border-brand-navy-light bg-brand-navy-light",
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
          "transition group-hover:text-brand-white text-brand-gray",
          {
            "text-brand-white": isActive,
          },
          textClassName
        )}
      />
      <Text
        className={cn(
          "group-hover:text-brand-white transition",
          isActive && "text-brand-white",
          textClassName
        )}
      >
        {label}
      </Text>
    </div>
  );
};
