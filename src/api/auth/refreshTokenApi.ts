import { api } from "../axiosApi";

export type RefreshTokenSuccess = { message?: string };
export type RefreshTokenError = { message: string; violations?: unknown[] };

export async function refreshTokenRequest(): Promise<RefreshTokenSuccess> {
  const result = await api.post<RefreshTokenSuccess>(`/token/refresh`);
  return result.data;
}
