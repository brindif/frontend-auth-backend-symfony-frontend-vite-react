import { api } from "../axiosApi";

export type ForgotPasswordRequest = { email: string; };
export type ForgotPasswordSuccess = { success: boolean; message?: string };
export type ForgotPasswordError = { success: boolean; message?: string; violations?: unknown[] };

export async function forgotPasswordRequest(
  payload: ForgotPasswordRequest
): Promise<ForgotPasswordSuccess> {

  const res = await api.post<ForgotPasswordSuccess>(
    `/change-password-request`,
    payload,
  );

  return res.data;
}
