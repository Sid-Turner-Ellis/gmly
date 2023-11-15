import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { Heading } from "../heading";
import { Text } from "../text";
import { Icon, IconType } from "../icon";
import { SidebarButton } from "./sidebar-button";
import Link from "next/link";
import { ClassValue } from "clsx";
import { useRouter } from "next/router";

type SidebarProps = {
  className?: ClassValue;
};

export const Sidebar = ({ className }: PropsWithChildren<SidebarProps>) => {
  const { pathname } = useRouter();
  const route = pathname.split("/")[1] || "home";

  return (
    <div className={cn("flex flex-col bg-brand-navy-light h-full", className)}>
      <div className="flex items-center gap-6 align-bottom ">
        <img src="/logo.png" className="w-12" />
        <h2 className="text-2xl text-brand-white">Gamerly</h2>
      </div>

      <nav className="flex flex-col justify-between mt-10 grow">
        <ul className="flex flex-col gap-3">
          <li>
            <Link href="/">
              <SidebarButton
                label={"Home"}
                icon="home"
                isActive={route === "home"}
              />
            </Link>
          </li>
          <li>
            <Link href="/battles">
              <SidebarButton
                label={"Battles"}
                icon="battles"
                isActive={route === "battles"}
              />
            </Link>
          </li>
          <li>
            <Link href="/tournaments">
              <SidebarButton
                label={"Tournaments"}
                icon="tournament"
                isActive={route === "tournaments"}
              />
            </Link>
          </li>
          <li>
            <SidebarButton label={"Exchange"} icon="exchange" />
          </li>
        </ul>

        <ul>
          <li className="mb-3">
            <Link href="/settings">
              <SidebarButton
                label={"Settings"}
                icon="settings"
                isActive={route === "settings"}
              />
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <SidebarButton
                label="Profile"
                icon="profile"
                textClassName="text-brand-white"
                buttonClassName="bg-brand-primary hover:bg-brand-primary-dark data-[active=true]:bg-brand-primary-dark data-[active=true]:border-brand-primary"
                isActive={route === "profile"}
              />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
