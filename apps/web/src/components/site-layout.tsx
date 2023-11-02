import { ReactNode, useEffect, useState } from "react";

import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import { Sidebar } from "./sidebar/sidebar";
import { Button } from "./button";
import { Icon } from "./icon";
import { twMerge } from "tailwind-merge";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isBigScreen = useTailwindBreakpoint("lg", { fallback: true });
  const { pathname } = useRouter();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex max-h-screen min-h-screen overflow-hidden bg-bg">
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
        <div className="sticky top-0 z-10 flex justify-between w-full px-6 py-6 lg:justify-end bg-bg">
          <div className="flex items-center gap-6 lg:hidden">
            <div
              onClick={() => setIsSidebarOpen(true)}
              className="flex flex-col w-10 gap-1.5 cursor-pointer"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-full h-[3px] rounded bg-white/70" />
              ))}
            </div>
            <img src="/logo.png" className="object-contain w-12" />
          </div>
          <div className="flex gap-3">
            <div className="relative hidden h-full group lg:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="search" size={20} className="hover:text-blue-500" />
              </div>
              <input
                type="text"
                className="h-full text-white pl-[45px] transition-all rounded bg-bg-light focus:shadow-none focus-visible:outline-whiteAlpha-100 focus:outline-whiteAlpha-100"
              />
            </div>
            <Button variant="secondary" icon="bell" className="h-full px-4" />
            <div className="hidden lg:block">
              <Button title="Exchange" icon="exchange" variant="primary" />
            </div>

            <Button
              title="Connect"
              icon="profile"
              variant="secondary"
              className="h-full"
            />
          </div>
        </div>
        <main className="px-6">{children}</main>
      </div>
    </div>
  );
};
