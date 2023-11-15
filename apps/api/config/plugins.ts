// TODO: add other image sizes to this too so that I can use it for the home page search too

const getExtraSmallImageFromEntry = (entry: any, key: string) => {
  try {
    const tinyImage = entry[key].formats.xsmall.url;
    if (!tinyImage) {
      throw new Error();
    }
    return tinyImage;
  } catch (error) {
    return null;
  }
};

export default {
  "schemas-to-ts": {
    enabled: false,
  },
  upload: {
    config: {
      breakpoints: {
        large: 1000,
        medium: 750,
        xsmall: 64,
      },
    },
  },
  meilisearch: {
    config: {
      host: "http://0.0.0.0:7700/",
      apiKey: "MASTER_KEY",
      game: {
        indexName: "global",
        settings: {
          filterableAttributes: ["collection_type"],
          sortableAttributes: ["collection_type", "name"],
        },
        transformEntry({ entry }) {
          return {
            id: entry.id,
            collection_type: "games",
            name: entry.title,
            image: entry.card_image,
          };
        },
      },
      profile: {
        indexName: "global",
        settings: {
          filterableAttributes: ["collection_type"],
          sortableAttributes: ["collection_type", "name"],
        },
        // Return true if the entry should be indexed
        filterEntry({ entry }) {
          return entry.username && entry.region;
        },
        transformEntry({ entry }) {
          return {
            id: entry.id,
            collection_type: "profiles",
            name: entry.username,
            image: entry.avatar,
          };
        },
      },
    },
  },
};
