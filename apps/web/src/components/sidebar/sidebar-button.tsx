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
        "flex items-center gap-4 p-4 transition cursor-pointer group rounded-xl hover:bg-slate-50/20",
        {
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
      <Text className={textClassName}>{label}</Text>
    </div>
  );
};
