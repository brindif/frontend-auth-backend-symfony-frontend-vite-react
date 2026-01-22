import { api } from "../axiosApi";

export type LogoutSuccess = { message?: string };
export type LogoutError = { message: string; violations?: unknown[] };

export async function logoutRequest(): Promise<LogoutSuccess> {
  const result = await api.post<LogoutSuccess>(`/logout`);
  
  return result.data;
}
