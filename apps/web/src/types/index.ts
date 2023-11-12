export type StrapiImage = {
  data: {
    id: number;
    attributes: {
      name: string;
      width: number;
      height: number;
      url: string;
      formats: {
        thumbnail: {
          width: number;
          height: number;
          url: string;
        };
      };
    };
  };
};
