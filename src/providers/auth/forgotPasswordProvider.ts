
import { AuthActionResponse } from "@refinedev/core";
import axios from "axios";
import { forgotPasswordRequest, ForgotPasswordError } from "../../api/auth/forgotPasswordApi";

export async function forgotPasswordProvider({ email }: any): Promise<AuthActionResponse> {
  try {
    const data = await forgotPasswordRequest({ email });
  } catch (e) {
    const data = axios.isAxiosError<ForgotPasswordError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "ForgotPasswordError",
        message: data?.message ?? "forgot.password.error.request",
      },
    };
  }
  return {
    success: true,
  }
};
