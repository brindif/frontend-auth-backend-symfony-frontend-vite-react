import axios from "axios";
import { AuthActionResponse } from "@refinedev/core"
import { registerRequest, RegisterError } from "../../api/auth/registerApi";

export async function registerProvider({ email, password }: any): Promise<AuthActionResponse> {
  try {
    const data = await registerRequest({ email, password });
  } catch (e) {
    const data = axios.isAxiosError<RegisterError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "RegisterError",
        message: data?.message ?? "register.error.request",
      },
    };
  }

  return {
    success: true,
    redirectTo: "/login",
  };
};
