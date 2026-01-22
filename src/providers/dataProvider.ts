import type {
  DataProvider,
  CrudFilters,
  CrudSorting,
} from "@refinedev/core";
import type { AxiosInstance } from "axios";

type Params = {
  sorters?: CrudSorting;
  filters?: CrudFilters;
  pagination?: { current?: number; pageSize?: number };
};

const buildQuery = ({ pagination }: Params) => {
  const query: Record<string, any> = {};
  if (pagination?.current) query.page = pagination.current;
  if (pagination?.pageSize) query.itemsPerPage = pagination.pageSize;
  return query;
};

export const makeDataProvider = (
  httpClient: AxiosInstance,
  apiUrl: string,
): DataProvider => ({
  getApiUrl: () => apiUrl,

  getList: async ({ resource, pagination, sorters, filters }) => {
    const { data } = await httpClient.get(`/${resource}`, {
      params: buildQuery({ pagination, sorters, filters }),
    });

    return {
      data: data["hydra:member"] ?? data,
      total: data["hydra:totalItems"] ?? (data?.length ?? 0),
    };
  },

  getOne: async ({ resource, id }) => {
    const { data } = await httpClient.get(`/${resource}/${id}`);
    return { data };
  },

  create: async ({ resource, variables }) => {
    const { data } = await httpClient.post(`/${resource}`, variables);
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await httpClient.patch(`/${resource}/${id}`, variables);
    return { data };
  },

  deleteOne: async ({ resource, id, variables }) => {
    const { data } = await httpClient.delete(`/${resource}/${id}`, {
      data: variables,
    });
    return { data };
  },

  custom: async ({ url, method, payload, query, headers }) => {
    const res = await httpClient.request({
      url,
      method,
      params: query,
      data: payload,
      headers,
    });

    return { data: res.data };
  },
});