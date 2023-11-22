import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { getCookie } from "cookies-next";
import { NextRequest } from "next/server";
import {
  ProfileResponse,
  ProfileService,
} from "@/features/profile/profile-service";
import { StrapiError } from "@/utils/strapi-error";
import { AuthenticatedUser } from "@/hooks/use-auth";
/**
 * TODO: think about removing the auth server from web and moving it to api. It would
 * be a case of setting up the endpoints and using the methods on the auth class:
 *
 * https://github.com/thirdweb-dev/js/blob/8d1b8a47e6d2262ef7e326ff561a30f401cb9834/packages/auth/src/core/auth.ts
 */

// These values can be found: https://github.com/thirdweb-dev/js/blob/main/packages/auth/src/constants/index.ts
const THIRDWEB_AUTH_COOKIE_PREFIX = `thirdweb_auth`;
const THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX = `${THIRDWEB_AUTH_COOKIE_PREFIX}_token`;
const THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE = `${THIRDWEB_AUTH_COOKIE_PREFIX}_active_account`;

// Functionality has been copied from: https://github.com/thirdweb-dev/js/blob/main/packages/auth/src/next/helpers/user.ts
const getTokenFromCookie = (req: NextRequest) => {
  const nextRequest = req as NextRequest;

  const activeAccount = getCookie(THIRDWEB_AUTH_ACTIVE_ACCOUNT_COOKIE, {
    req: nextRequest,
  });
  const cookieName = activeAccount
    ? `${THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX}_${activeAccount}`
    : THIRDWEB_AUTH_TOKEN_COOKIE_PREFIX;

  const token = getCookie(cookieName, {
    req: nextRequest,
  });

  return token ?? false;
};

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: "gamerly.app",
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  authOptions: {
    refreshIntervalInSeconds: 60 * 60 * 3, // Note that refreshing occurs whenever /user endpoint is hit
    tokenDurationInSeconds: 60 * 60 * 24 * 7,
  },
  cookieOptions: {},
  callbacks: {
    async onLogin(address, req) {},
    async onUser({ address, session }, req) {
      const nextRequest = req as NextRequest;
      const token = getTokenFromCookie(nextRequest);

      let profile: AuthenticatedUser["data"]["profile"];

      try {
        const profileResponse = await ProfileService.getProfile(address);
        const {
          username,
          wallet_address,
          region,
          wager_mode,
          trust_mode,
          bio,
          createdAt,
          avatar,
          team_profiles,
        } = profileResponse.attributes;

        profile = {
          id: profileResponse.id,
          username,
          wallet_address,
          region,
          wager_mode,
          trust_mode,
          createdAt,
          bio,
          avatar,
          team_profiles,
        };
      } catch (error) {
        const isProfileNotFound =
          StrapiError.isStrapiError(error) && error.error.status === 404;

        if (isProfileNotFound) {
          const newProfileResponse = await ProfileService.createProfile(
            address
          );

          profile = {
            id: newProfileResponse.id,
            wallet_address: address,
            region: null,
            username: null,
            wager_mode: false,
            trust_mode: false,
            createdAt: newProfileResponse.attributes.createdAt,
            bio: null,
            avatar: null,
            team_profiles: [],
          };
        } else {
          throw error;
        }
      }

      return {
        token: token || null,
        profile,
      };
    },
  },
});

export default ThirdwebAuthHandler();
