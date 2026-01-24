import { api } from "../axiosApi";

export const TYPE_PASSWORD = 'password' as const;
export const TYPE_EMAIL = 'email' as const;

export type UpdateRequestRequest = {
  email: string;
  type: typeof TYPE_PASSWORD | typeof TYPE_EMAIL
};
export type UpdateRequestSuccess = { success: boolean; message?: string };
export type UpdateRequestError = { success: boolean; message?: string; violations?: unknown[] };

export async function updateRequestRequest(
  payload: UpdateRequestRequest
): Promise<UpdateRequestSuccess> {

  const res = await api.post<UpdateRequestSuccess>(
    `/me/request`,
    payload,
  );

  return res.data;
}
