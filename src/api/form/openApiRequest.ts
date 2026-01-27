import { api } from "../axiosApi";
import  type { OpenApi as OpenApiType } from "../../store/form/slice";

export type OpenApiError = {
  success: boolean;
  message: string;
};

export async function openApiRequest(): Promise<OpenApiType> {

  const res = await api.get<OpenApiType>(`/docs.jsonopenapi`);
  return res.data;
}
