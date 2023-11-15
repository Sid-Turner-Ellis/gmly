import { cn } from "@/utils/cn";
import { Button } from "../button";
import { Icon } from "../icon";
import { ClassValue } from "clsx";
import {
  useAddress,
  useMetamask,
  useLogin,
  useLogout,
  useDisconnect,
  useUser,
  ConnectWallet,
  useConnectionStatus,
  darkTheme,
} from "@thirdweb-dev/react";
import { ProfileButtons } from "./profile-buttons";
import { useAuth } from "@/hooks/use-auth";
import { GlobalSearchBar } from "../../features/global-search/components/global-search-bar";
import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";

type HeaderProps = {
  openSidebar: () => void;
  className?: ClassValue;
};

export const THIRDWEB_CONNECT_BUTTON_CLASSNAME =
  "gamerly-thirdweb-connect-button";

export const Header = ({ openSidebar, className }: HeaderProps) => {
  const { user, logout } = useAuth();
  const shouldShowProfileButtons =
    user && user.data?.profile.username && user.data.profile.region;
  const handleOnConnect = async () => {
    const thirdwebButton = document.querySelector(
      `.${THIRDWEB_CONNECT_BUTTON_CLASSNAME}`
    ) as HTMLElement;

    thirdwebButton?.click();
  };

  return (
    <div
      className={cn(
        "sticky top-0 flex justify-between w-full py-6 lg:justify-end bg-brand-navy",
        className
      )}
    >
      <div className="flex items-center gap-6 lg:hidden">
        <div
          onClick={openSidebar}
          className="flex flex-col w-8 gap-1.5 cursor-pointer"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full h-[3px] rounded bg-white/70" />
          ))}
        </div>
        <img src="/logo.png" className="hidden object-contain w-12 lg:block" />
      </div>
      <div className="inline-flex gap-2 lg:gap-3">
        <div className="relative w-40 h-full xs:w-56 md:w-96">
          <GlobalSearchBar />
        </div>
        <Button
          variant="secondary"
          icon="bell"
          className="hidden h-full px-3 lg:block"
        />

        {!shouldShowProfileButtons && (
          <>
            <div className="hidden lg:block">
              <Button title="Exchange" icon="exchange" variant="primary" />
            </div>

            <div className="relative" onClick={handleOnConnect}>
              <Button title="Connect" icon="profile" variant="secondary" />
              <ConnectWallet
                modalSize="compact"
                className={`!hidden ${THIRDWEB_CONNECT_BUTTON_CLASSNAME}`}
                switchToActiveChain={true}
                auth={{
                  loginOptional: false,
                }}
                theme={darkTheme({
                  colors: {
                    accentText: "var(--brand-color-primary)",
                    accentButtonBg: "var(--brand-color-primary)",
                  },
                })}
              />
            </div>
          </>
        )}
        {shouldShowProfileButtons && (
          <span
            onClick={() => {
              logout();
            }}
          >
            <ProfileButtons />
          </span>
        )}
      </div>
    </div>
  );
};
