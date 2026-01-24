
import { AuthActionResponse } from "@refinedev/core";
import axios from "axios";
import { updateRequestRequest, UpdateRequestError } from "../../api/auth/updateRequestApi";

export async function updateRequestProvider({ email, type }: any): Promise<AuthActionResponse> {
  try {
    const data = await updateRequestRequest({ email, type });
  } catch (e) {
    const data = axios.isAxiosError<UpdateRequestError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "UpdateRequestError",
        message: data?.message ?? "forgot.password.error.request",
      },
    };
  }
  return {
    success: true,
  }
};
