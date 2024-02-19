/**
 * This file was automatically generated by Strapi.
 * Any modifications made will be discarded.
 */
import i18N from "@strapi/plugin-i18n/strapi-admin";
import usersPermissions from "@strapi/plugin-users-permissions/strapi-admin";
import meilisearch from "strapi-plugin-meilisearch/strapi-admin";
import publicPermissions from "strapi-plugin-public-permissions/strapi-admin";
import { renderAdmin } from "@strapi/strapi/admin";

renderAdmin(document.getElementById("strapi"), {
  plugins: {
    i18n: i18N,
    "users-permissions": usersPermissions,
    meilisearch: meilisearch,
    "public-permissions": publicPermissions,
  },
});