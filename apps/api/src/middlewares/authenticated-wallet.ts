import { Strapi } from "@strapi/strapi";
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

const wallet = new PrivateKeyWallet(
  process.env.GAMERLY_SMART_CONTRACT_OWNER_PRIVATE_KEY || ""
);

// Per engineering: we have a verify function in the auth sdk. You need both addresses (backend wallet address and the user wallet address)

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    try {
      const thirdWebToken = ctx.headers["x-custom-auth"];

      if (thirdWebToken) {
        const auth = new ThirdwebAuth(wallet, "gamerly.app");
        const { address } = await auth.authenticate(thirdWebToken);
        // TODO: make sure this is checking expiry date
        ctx.state.wallet_address = address ?? null;
      }
    } catch (error) {
      ctx.state.wallet_address = null;
    }
    await next();
  };
};
