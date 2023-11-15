import { Text } from "@/components/text";
import { cn } from "@/utils/cn";
import { ReactNode, forwardRef } from "react";

export const GlobalSearchBarItemLayout = forwardRef<
  any,
  {
    Left?: ReactNode;
    Middle: ReactNode | string;
    Right?: ReactNode | string;
    onClick?: () => void;
  }
>(({ onClick, Left, Middle, Right }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={cn("flex items-center w-full justify-between p-2 transition", {
      "cursor-default": !onClick,
      "cursor-pointer hover:bg-brand-navy-light-accent-light": !!onClick,
    })}
  >
    <div className="flex items-center gap-3 grow">
      {Left && (
        <div className="min-w-[40px] w-[40px] max-w-[40px] min-h-[40px] h-[40px] max-h-[40px] relative rounded overflow-hidden">
          {Left}
        </div>
      )}
      <div className="grow">
        {typeof Middle === "string" ? (
          <Text variant="p" className={"text-brand-white"}>
            {Middle}
          </Text>
        ) : (
          Middle
        )}
      </div>
    </div>
    {typeof Right === "string" ? <Text variant="p">{Right}</Text> : Right}
  </div>
));

GlobalSearchBarItemLayout.displayName = "GlobalSeadrchBarItemLayout";
