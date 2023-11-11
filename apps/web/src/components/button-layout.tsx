import { PropsWithChildren } from "react";

export const ButtonLayout = ({}: PropsWithChildren<{ text: string }>) => {
  return (
    <div className="inline-flex items-center justify-center gap-3 px-4 py-2">
      <div className="w-10 h-10 min-h-10 max-h-10 min-w-10 max-w-10"></div>
    </div>
  );
};
