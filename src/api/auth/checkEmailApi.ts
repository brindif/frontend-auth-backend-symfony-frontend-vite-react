import { api } from "../axiosApi";

export type CheckEmailRequest = {
  token: string;
};
export type CheckEmailSuccess = { success: boolean, message?: string };
export type CheckEmailError = { success: boolean, message: string; violations?: unknown[] };

export async function checkEmailRequest(
  payload: CheckEmailRequest
): Promise<CheckEmailSuccess> {
  const result = await api.get<CheckEmailSuccess>(
    `/check-email`,
    {
      params: payload,
      withCredentials: true,
    },
  );
  return result.data;
}
