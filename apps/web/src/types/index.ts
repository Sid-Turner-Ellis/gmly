type ImageFormat = {
  width: number;
  height: number;
  url: string;
};

export type StrapiImageResponse = {
  data: {
    id: number;
    attributes: StrapiImage;
  };
};

export const isStrapiImageResponse = (i: unknown): i is StrapiImageResponse => {
  const image = i as StrapiImageResponse;
  return (
    typeof image?.data?.id === "number" &&
    isStrapiImage(image?.data?.attributes)
  );
};

export type StrapiImage = {
  name: string;
  formats: {
    thumbnail: ImageFormat | null; // The available format depends on the image type uploaded
    xsmall: ImageFormat | null;
    medium: ImageFormat | null;
    large: ImageFormat | null;
  } | null;
} & ImageFormat;

export const isStrapiImage = (i: unknown): i is StrapiImage => {
  const image = i as StrapiImage;
  return (
    typeof image?.name === "string" &&
    typeof image?.width === "number" &&
    typeof image?.height === "number" &&
    typeof image?.url === "string"
  );
};

export type StrapiEntity<T extends Record<string, any>> = {
  id: number;
  attributes: T & {
    createdAt: string; // ISO 8601
  };
};
