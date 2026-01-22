import { api } from "../axiosApi";

export type VerifyEmailRequest = {
  expires: string;
  signature: string;
  token: string;
  id: number;
};
export type VerifyEmailSuccess = { message?: string };
export type VerifyEmailError = { message: string; violations?: unknown[] };

export async function verifyEmailRequest(
  payload: VerifyEmailRequest
): Promise<VerifyEmailSuccess> {
  const result = await api.get<VerifyEmailSuccess>(
    `/verify/email`,
    {
      params: payload,
      withCredentials: true,
    },
  );
  return result.data;
}
