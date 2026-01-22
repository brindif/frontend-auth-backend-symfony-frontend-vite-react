import { api } from "../axiosApi";

export type LoginRequest = { email: string; password: string; remember: boolean };
export type LoginSuccess = { success: boolean; message?: string };
export type LoginError = { success: boolean; message?: string; violations?: unknown[] };

export async function loginRequest(
  payload: LoginRequest
): Promise<LoginSuccess> {

  const res = await api.post<LoginSuccess>(
    `/login/check`,
    payload,
  );

  return res.data;
}
