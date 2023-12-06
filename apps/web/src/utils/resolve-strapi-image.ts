import {
  StrapiEntity,
  StrapiImage,
  StrapiRelation,
  isStrapiImage,
} from "@/types/strapi-types";

const addUrl = (url: string) =>
  `${process.env.NEXT_PUBLIC_STRAPI_PROTOCOL}://${process.env.NEXT_PUBLIC_STRAPI_HOSTNAME}${url}`;

const isStrapiRelationImage = (
  v: unknown
): v is StrapiRelation<StrapiEntity<StrapiImage>> =>
  !!(v as StrapiRelation<StrapiEntity<StrapiImage>>).data;

export const resolveStrapiImage = (
  image:
    | StrapiImage
    | StrapiRelation<StrapiEntity<StrapiImage>>
    | null
    | undefined,
  format?: keyof NonNullable<StrapiImage["formats"]>
) => {
  const imageData = isStrapiRelationImage(image)
    ? image.data?.attributes
    : image;

  const defaultUrl = imageData?.url;

  if (!defaultUrl) {
    return "/image-placeholder.jpg";
  }

  if (!format) {
    return addUrl(defaultUrl);
  }

  // TODO: Start choosing nearest format to the requested one

  const formatUrl = imageData?.formats?.[format]?.url;
  return addUrl(formatUrl || defaultUrl);
};
