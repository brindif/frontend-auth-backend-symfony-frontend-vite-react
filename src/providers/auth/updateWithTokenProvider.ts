import axios from "axios";
import { AuthActionResponse } from "@refinedev/core"
import { updateWithTokenRequest, UpdateWithTokenError } from "../../api/auth/updateWithTokenApi";

export async function updateWithTokenProvider({ password, email, token }: any): Promise<AuthActionResponse> {
  try {
    const data = await updateWithTokenRequest({ password, email, token });
  } catch (e) {
    const data = axios.isAxiosError<UpdateWithTokenError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "UpdateWithTokenError",
        message: data?.message ?? "update.password.error.request",
      },
    };
  }

  return {
    success: true,
    redirectTo: "/login",
  };
};
