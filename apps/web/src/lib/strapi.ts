import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import QueryString from "qs";

type StrapiError = {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
};

type StrapiBaseRequestParams = {
  fields?: Array<string>;
  populate?: string | Array<string> | Record<string, unknown>;
};

type StrapiFindRequestParams = StrapiBaseRequestParams & {
  sort?: string | Array<string>;
  pagination?: {
    page: number;
    pageSize: number;
    withCount?: true;
  };
  filters?: Record<string, unknown>;
  publicationState?: "live" | "preview";
  locale?: string;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type StrapiResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta: M & Record<string, unknown>;
};

class Strapi {
  private _api: AxiosInstance;

  constructor() {
    this._api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      paramsSerializer: (params) => QueryString.stringify(params),
    });

    this._api.interceptors.request.use((config) => {
      // console.log("request made", config);
      return config;
    });
    this._api.interceptors.response.use((config) => {
      // console.log("response recieved", config);
      return config;
    });
  }

  async request<T>(
    method: Method,
    url: string,
    axiosConfig: AxiosRequestConfig
  ): Promise<T> {
    // TODO: make sure this is throwing strapi errors
    try {
      const response: AxiosResponse<T> = await this._api.request<T>({
        method,
        url,
        ...axiosConfig,
      });
      return response.data;
    } catch (error) {
      const e = error as AxiosError<StrapiError>;

      // Always throw an error object
      if (!e.response) {
        throw {
          data: null,
          error: {
            status: 500,
            name: "UnknownError",
            message: e.message,
            details: e,
          },
        };
      } else {
        throw e.response.data;
      }
    }
  }

  async find<T>(
    contentType: string,
    params?: StrapiFindRequestParams
  ): Promise<StrapiResponse<T[], PaginationMeta>> {
    if (params && params.pagination) {
      params.pagination.withCount = true;
    }
    return this.request<StrapiResponse<T[], PaginationMeta>>(
      "GET",
      `/${contentType}`,
      {
        params,
      }
    );
  }

  async findOne<T>(
    contentType: string,
    id: string | number,
    params?: StrapiBaseRequestParams
  ): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>("GET", `/${contentType}/${id}`, {
      params,
    });
  }
}

export const strapiApi = new Strapi();
