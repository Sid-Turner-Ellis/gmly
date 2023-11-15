import {
  StrapiImage,
  StrapiImageResponse,
  isStrapiImage,
  isStrapiImageResponse,
} from "@/types";

const addUrl = (url: string) =>
  `https://${process.env.NEXT_PUBLIC_STRAPI_HOSTNAME}${url}`;

export const resolveStrapiImage = (
  image: StrapiImage | StrapiImageResponse | null,
  format?: keyof NonNullable<StrapiImage["formats"]>
) => {
  const imageData = isStrapiImageResponse(image)
    ? image.data.attributes
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
