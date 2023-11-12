import { StrapiImage } from "@/types";

const addUrl = (url: string | null | undefined) =>
  url ? `https://${process.env.NEXT_PUBLIC_STRAPI_HOSTNAME}${url}` : null;

export const parseStrapiImage = (image: StrapiImage | null) => {
  const mainUrl = image?.data.attributes.url;
  const thumbnailUrl = image?.data.attributes.formats.thumbnail.url ?? mainUrl;

  return {
    url: addUrl(mainUrl) || "/image-placeholder.jpg",
    thumbnailUrl:
      addUrl(thumbnailUrl) || addUrl(mainUrl) || "/image-placeholder.jpg",
  };
};
