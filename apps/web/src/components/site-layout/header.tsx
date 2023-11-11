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

type HeaderProps = {
  openSidebar: () => void;
  className?: ClassValue;
};

export const THIRDWEB_CONNECT_BUTTON_CLASSNAME =
  "gamerly-thirdweb-connect-button";

export const Header = ({ openSidebar, className }: HeaderProps) => {
  const { logout } = useLogout();
  const { user, isLoggedIn, isLoading } = useAuth();
  const disconnect = useDisconnect();
  const shouldShowProfileButtons =
    isLoggedIn &&
    user &&
    user.data?.profile.username &&
    user.data.profile.region;

  const handleOnConnect = async () => {
    const thirdwebButton = document.querySelector(
      `.${THIRDWEB_CONNECT_BUTTON_CLASSNAME}`
    ) as HTMLElement;

    thirdwebButton?.click();
  };

  console.log("user", user);

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
            className="h-full text-white pl-[45px] transition-all rounded bg-brand-navy-light focus:shadow-none focus-visible:outline-whiteAlpha-100 focus:outline-whiteAlpha-100"
          />
        </div>
        <Button variant="secondary" icon="bell" className="h-full px-4" />

        {!shouldShowProfileButtons && (
          <>
            <div className="hidden lg:block">
              <Button title="Exchange" icon="exchange" variant="primary" />
            </div>

            <div className="relative" onClick={handleOnConnect}>
              <Button
                title="Connect"
                icon="profile"
                variant="secondary"
                className="h-full"
              />
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
              disconnect();
            }}
          >
            <ProfileButtons />
          </span>
        )}
      </div>
    </div>
  );
};
