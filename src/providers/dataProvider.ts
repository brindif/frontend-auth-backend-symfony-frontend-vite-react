import type {
  DataProvider,
  CrudFilters,
  CrudSorting,
} from "@refinedev/core";
import type { AxiosInstance } from "axios";

type Params = {
  sorters?: CrudSorting;
  filters?: CrudFilters;
  pagination?: { currentPage?: number; pageSize?: number };
};

const buildQuery = ({ pagination, sorters, filters }: Params) => {
  const query: Record<string, any> = {};
  if (pagination?.currentPage) query.page = pagination.currentPage;
  if (pagination?.pageSize) query.itemsPerPage = pagination.pageSize;
  if (filters && filters.length > 0) {
    for (const filter of filters) {
      if ('field' in filter && filter.operator === 'eq') {
        query[filter.field] = filter.value;
      }
    }
  }
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
      data: data["member"] ?? data,
      total: data["totalItems"] ?? (data?.length ?? 0),
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
    const { data } = await httpClient.put(`/${resource}/${id}`, variables);
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