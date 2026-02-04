import { store } from "../../store/store";
import { clearAuth } from "../../store/auth/slice";
import { clearTabs } from "../../store/tab/slice";
import axios from "axios";
import { logoutRequest, LogoutError } from "../../api/auth/logoutApi";
import { AuthActionResponse } from "@refinedev/core"

export async function logoutProvider(): Promise<AuthActionResponse> {
  try {
    const data = await logoutRequest();

    store.dispatch(clearAuth());
    store.dispatch(clearTabs());
    return {
      success: true,
      successNotification: { message: "logout.success" },
      redirectTo: "/login",
    };
  } catch (e) {
    const data = axios.isAxiosError<LogoutError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "LogoutError",
        message: e instanceof Error && data?.message ? e?.message : "logout.error.request",
      },
    };
  }
};
