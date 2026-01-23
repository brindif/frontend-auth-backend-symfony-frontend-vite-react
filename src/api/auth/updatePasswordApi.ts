import { api } from "../axiosApi";

export type UpdatePasswordRequest = { token: string; password: string; };
export type UpdatePasswordSuccess = { success: boolean; message?: string };
export type UpdatePasswordError = { success: boolean; message?: string; violations?: unknown[] };

export async function updatePasswordRequest(
  payload: UpdatePasswordRequest
): Promise<UpdatePasswordSuccess> {

  const res = await api.patch<UpdatePasswordSuccess>(
    `/update-password`,
    payload,
  );

  return res.data;
}
