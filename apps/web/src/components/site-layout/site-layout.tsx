import { ReactNode, useEffect, useState } from "react";

import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import { Sidebar } from "./sidebar";
import { Button } from "../button";
import { Icon } from "../icon";
import { twMerge } from "tailwind-merge";
import { Header } from "./header";

const pageWidthClasses = "px-14";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isBigScreen = useTailwindBreakpoint("lg", { fallback: true });
  const { pathname } = useRouter();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-full overflow-hidden bg-bg">
      <aside>
        <Sidebar
          className={cn("bg-bg-light w-72 max-w-full px-4 py-6", {
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
        <Header
          className={pageWidthClasses}
          openSidebar={() => setIsSidebarOpen(true)}
        />
        <main className={pageWidthClasses}>{children}</main>
      </div>
    </div>
  );
};