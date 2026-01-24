import { api } from "../axiosApi";

export type UpdateWithTokenRequest = {
  token: string;
  password?: string;
  email?: string;
};
export type UpdateWithTokenSuccess = { success: boolean; message?: string };
export type UpdateWithTokenError = { success: boolean; message?: string; violations?: unknown[] };

export async function updateWithTokenRequest(
  payload: UpdateWithTokenRequest
): Promise<UpdateWithTokenSuccess> {

  const res = await api.patch<UpdateWithTokenSuccess>(
    `/me/token`,
    payload,
  );

  return res.data;
}
