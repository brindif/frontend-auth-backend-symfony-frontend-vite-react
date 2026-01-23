import axios from "axios";
import { AuthActionResponse } from "@refinedev/core"
import { updatePasswordRequest, UpdatePasswordError } from "../../api/auth/updatePasswordApi";

export async function updatePasswordProvider({ password, token }: any): Promise<AuthActionResponse> {
  try {
    const data = await updatePasswordRequest({ password, token });
  } catch (e) {
    const data = axios.isAxiosError<UpdatePasswordError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "UpdatePasswordError",
        message: data?.message ?? "update.password.error.request",
      },
    };
  }

  return {
    success: true,
    redirectTo: "/login",
  };
};
