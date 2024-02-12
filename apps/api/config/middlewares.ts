export default [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: ["*"],
      headers: ["x-custom-auth", "Content-Type", "Authorization", "Accept"],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  "global::add-auth-state",
];
