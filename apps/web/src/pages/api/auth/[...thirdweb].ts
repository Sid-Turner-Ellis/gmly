import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { getCookie } from "cookies-next";
import { NextRequest } from "next/server";

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
    async onUser({ address, session }, req) {
      const nextRequest = req as NextRequest;
      const token = getTokenFromCookie(nextRequest);

      // get the users details

      return {
        token: token || null,
      };
    },
  },
});

export default ThirdwebAuthHandler();
