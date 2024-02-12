/**
 * is-user policy
 */

export default (policyContext, config, { strapi }) => {
  return !!policyContext.state.wallet_address;
};
