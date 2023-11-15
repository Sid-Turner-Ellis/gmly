import { ReactNode } from "react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";

export const ProfilePageLayout = ({
  Right,
  LeftTop,
  LeftMiddle,
  LeftBottom,
}: {
  Right: ReactNode;
  LeftTop: ReactNode;
  LeftMiddle: ReactNode;
  LeftBottom: ReactNode;
}) => (
  <div className="relative z-0">
    <div className="flex gap-0 sm:gap-4 md:gap-6">
      <div className="w-40">
        <AspectRatio.Root ratio={1}>{Right}</AspectRatio.Root>
      </div>
      <div>
        <div className="flex flex-col gap-1">
          <div className="">{LeftTop}</div>
          <div className="mb-0">{LeftMiddle}</div>
          <div className="max-w-[550px]">{LeftBottom}</div>
        </div>
      </div>
    </div>
  </div>
);
