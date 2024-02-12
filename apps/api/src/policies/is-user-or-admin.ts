/**
 * is-user-or-admin policy
 */

export default ({ state }, config, { strapi }) => {
  return !!state.wallet_address || !!state.api_token;
};
