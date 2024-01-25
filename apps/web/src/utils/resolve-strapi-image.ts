import {
  StrapiEntity,
  StrapiImage,
  StrapiRelation,
  isStrapiImage,
} from "@/types/strapi-types";

const addUrl = (url: string) =>
  `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_HOST_NAME}${url}`;

const isStrapiRelationImage = (
  v: unknown
): v is StrapiRelation<StrapiEntity<StrapiImage>> =>
  !!(v as StrapiRelation<StrapiEntity<StrapiImage>>)?.data;

export const resolveStrapiImage = (
  image:
    | StrapiImage
    | StrapiRelation<StrapiEntity<StrapiImage>>
    | null
    | undefined,
  options: Partial<{
    format: keyof NonNullable<StrapiImage["formats"]>;
    noFallback: boolean;
  }> = {}
) => {
  const imageData = isStrapiRelationImage(image)
    ? image?.data?.attributes
    : image;

  const defaultUrl = imageData?.url;

  if (!defaultUrl) {
    if (options.noFallback) {
      return "";
    }
    return "/image-placeholder.jpg";
  }

  if (!options.format) {
    return addUrl(defaultUrl);
  }

  // TODO: Start choosing nearest format to the requested one
  const formatUrl = imageData?.formats?.[options.format]?.url;
  return addUrl(formatUrl || defaultUrl);
};
