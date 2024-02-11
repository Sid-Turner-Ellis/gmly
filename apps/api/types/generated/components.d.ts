import type { Schema, Attribute } from '@strapi/strapi';

export interface GeneralSocialLinks extends Schema.Component {
  collectionName: 'components_general_social_links';
  info: {
    displayName: 'Social Links';
    description: '';
  };
  attributes: {
    discord: Attribute.String;
    twitter: Attribute.String;
    twitch: Attribute.String;
    youtube: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'general.social-links': GeneralSocialLinks;
    }
  }
}
