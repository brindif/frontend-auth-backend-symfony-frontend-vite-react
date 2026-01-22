import axios from "axios";

import { registerRequest, RegisterError } from "../../api/auth/registerApi";

export async function registerProvider({ email, password }) {
  try {
    const data = await registerRequest({ email, password });
  } catch (e: unknown) {
    const data = axios.isAxiosError<RegisterError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "RegisterError",
        message: e instanceof Error ? e.error : "register.error.request",
      },
      message: data,
    };
  }

  return {
    success: true,
    message: 'register.verify.email',
    redirectTo: "/login",
  };
};
