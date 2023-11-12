import { THIRDWEB_CONNECT_BUTTON_CLASSNAME } from "@/components/site-layout/header";
import { ProfileResponse } from "@/services/profiles";
import {
  UserWithData,
  useDisconnect,
  useLogout,
  useUser,
} from "@thirdweb-dev/react";
import { log } from "console";
import { useRouter } from "next/router";
import { useEffect } from "react";

export type AuthenticatedUser = {
  address: string;
  data: {
    profile: ProfileResponse["attributes"] & { id: ProfileResponse["id"] };
    token: string;
  };
};

const isAuthenticatedUser = (d: unknown): d is AuthenticatedUser => {
  const user = d as AuthenticatedUser;

  return !!(
    user?.address &&
    user?.data &&
    user?.data?.profile &&
    user?.data?.token
  );
};

export const useAuth = (guard?: boolean) => {
  const { user: untypedUser, isLoggedIn, isLoading } = useUser();
  const { logout: thirdWebLogout } = useLogout();
  const router = useRouter();
  const disconnectWallet = useDisconnect();
  const user = isAuthenticatedUser(untypedUser) ? untypedUser : null;
  const completedRegistration =
    user?.data.profile.username && user?.data.profile.region;

  const logout = () => {
    thirdWebLogout();
    disconnectWallet();
    router.replace("/");
  };

  useEffect(() => {
    if (guard && !isLoggedIn) {
      router.replace("/");

      // Redirect home and open the connect button modal
      const thirdWebButton = document.querySelector(
        `.${THIRDWEB_CONNECT_BUTTON_CLASSNAME}`
      );

      if (thirdWebButton) {
        (thirdWebButton as HTMLElement).click();
      }
    }
  }, [user]);

  return {
    user,
    isLoggedIn,
    isLoading,
    logout,
    completedRegistration,
  } as const;
};
