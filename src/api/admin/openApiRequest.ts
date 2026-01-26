import { api } from "../axiosApi";
import { OpenApiType } from "../../store/admin/slice";

export type OpenApiError = {
  success: boolean;
  message: string;
};

export async function openApiRequest(): Promise<OpenApiType> {

  const res = await api.get<OpenApiType>(`/docs.jsonopenapi`);
  return res.data;
}
