import { api } from "../axiosApi";

export type RegisterRequest = { email: string; password: string };
export type RegisterSuccess = { message?: string };
export type RegisterError = { message: string; violations?: unknown[] };

export async function registerRequest(
  payload: RegisterRequest
): Promise<RegisterSuccess> {
  const result = await api.post<RegisterSuccess>(
    `/register`,
    payload,
  );
  return result.data;
}
