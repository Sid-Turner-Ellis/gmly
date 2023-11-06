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
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

type HeaderProps = {
  openSidebar: () => void;
  className?: ClassValue;
};

/**
 *
 * How to determine whether the user is already registered or not?
 * Just do it in the API route
 *
 */

export const Header = ({ openSidebar, className }: HeaderProps) => {
  const address = useAddress();
  const connect = useMetamask();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoggedIn } = useUser();
  const [shouldLogin, setShouldLogin] = useState(false);
  const disconnect = useDisconnect();

  useEffect(() => {
    if (shouldLogin && !isLoggedIn && address) {
      login();
      setShouldLogin(false);
    }
  }, [shouldLogin, isLoggedIn, address]);

  console.log(user);

  const handleOnConnect = async () => {
    await connect();
    setShouldLogin(true);
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex justify-between w-full py-6 lg:justify-end bg-bg",
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
            className="h-full text-white pl-[45px] transition-all rounded bg-bg-light focus:shadow-none focus-visible:outline-whiteAlpha-100 focus:outline-whiteAlpha-100"
          />
        </div>
        <Button variant="secondary" icon="bell" className="h-full px-4" />
        <div className="hidden lg:block">
          <Button title="Exchange" icon="exchange" variant="primary" />
        </div>

        {isLoggedIn && <div> logged in </div>}
        {!isLoggedIn && (
          <Button
            title="Connect"
            icon="profile"
            variant="secondary"
            className="h-full"
            onClick={handleOnConnect}
          />
        )}

        {isLoggedIn && (
          <Button
            isDisabled={!isLoggedIn}
            title="log out"
            onClick={() => {
              logout();
              disconnect();
            }}
          />
        )}
      </div>
    </div>
  );
};
