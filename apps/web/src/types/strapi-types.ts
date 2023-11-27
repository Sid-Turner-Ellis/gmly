export type OmitEntityAttributes<
  T extends StrapiEntity<any>,
  K extends keyof T["attributes"]
> = {
  [P in keyof T]: P extends "attributes" ? Omit<T[P], K> : T[P];
};

export type PickEntityAttributes<
  T extends StrapiEntity<any>,
  K extends keyof T["attributes"]
> = {
  [P in keyof T]: P extends "attributes" ? Pick<T[P], K> : T[P];
};

export type ModifyEntity<
  T extends StrapiEntity<any>,
  K extends keyof T["attributes"],
  Modifications extends Record<string, any>
> = {
  [P in keyof T]: P extends "attributes" ? Omit<T[P], K> & Modifications : T[P];
};

export type StrapiRelation<
  T extends StrapiEntity<any> | StrapiEntity<any>[],
  Nullable = true
> = Nullable extends true ? { data: T | null } : { data: T };

export const isStrapiRelationDefined = <
  T extends StrapiRelation<StrapiEntity<any>, any>
>(
  relation: T
): relation is T & { data: NonNullable<T["data"]> } => {
  return relation && typeof relation === "object" && relation.data !== null;
};

export type ModifyRelationAttributes<
  R extends StrapiRelation<StrapiEntity<any> | StrapiEntity<any>[]>,
  Modifications extends Record<string, any>
> = R extends { data: infer D }
  ? {
      data: D extends Array<StrapiEntity<infer AttrArray>>
        ? Array<{ attributes: AttrArray & Modifications }>
        : D extends StrapiEntity<infer Attr>
        ? { attributes: Attr & Modifications }
        : null;
    }
  : never;

type ImageFormat = {
  width: number;
  height: number;
  url: string;
};

export type StrapiImageResponse = {
  data: {
    id: number;
    attributes: StrapiImage;
  } | null;
};

export const isStrapiImageResponse = (i: unknown): i is StrapiImageResponse => {
  const image = i as StrapiImageResponse;
  return (
    typeof image?.data?.id === "number" &&
    isStrapiImage(image?.data?.attributes)
  );
};

// TODO: StrapiImageResponse and StrapiImage are different - the strapiIMage has an ID whereas the response has the id on the 'id' props
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
