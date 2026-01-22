import { store } from "../../store/store";
import { clearAuth, setCurentUser } from "../../store/auth/slice";
import axios from "axios";
import { logoutRequest, LogoutError } from "../../api/auth/logoutApi";

export async function logoutProvider() {
  try {
    const data = await logoutRequest();

    store.dispatch(clearAuth());
    return {
      success: true,
      successNotification: "logout.success",
      redirectTo: "/login",
    };
  } catch (e) {
    const data = axios.isAxiosError<LogoutError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "LogoutError",
        message: e instanceof Error ? data?.message?.error : "logout.error.request",
        successNotification: "logout.error.request",
      },
      message: {error: data?.message},
    };
  }
};
