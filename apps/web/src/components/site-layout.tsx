import { ReactNode, useEffect, useState } from "react";

import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import { Sidebar } from "./sidebar/sidebar";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isBigScreen = useTailwindBreakpoint("lg", { fallback: true });
  const { pathname } = useRouter();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex max-h-screen min-h-screen overflow-hidden">
      <aside>
        <Sidebar
          className={cn("bg-bg-light w-72 max-w-full md:w-80 px-4 py-6", {
            "fixed z-30 right-full transition-all duration-200": !isBigScreen,
            "translate-x-full": !isBigScreen && isSidebarOpen,
          })}
        />
      </aside>
      <div className="overflow-y-auto grow">
        <div
          onClick={() => {
            setIsSidebarOpen(false);
          }}
          className={cn(
            "absolute inset-0 z-20 bg-black opacity-0 pointer-events-none",
            {
              "opacity-50 pointer-events-auto": isSidebarOpen && !isBigScreen,
            }
          )}
        />
        <div className="sticky top-0 z-10 bg-red-300">
          <button
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            click
          </button>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
};
