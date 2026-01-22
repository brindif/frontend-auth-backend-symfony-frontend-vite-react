import axios from "axios";

import { store } from "../../store/store";
import { loginRequest, LoginRequest, LoginError } from "../../api/auth/loginApi";
import { currentUserRequest, CurrentUserError } from "../../api/auth/currentUserApi";
import { setAuthed, setCurentUser } from "../../store/auth/slice";

export async function loginProvider(fields: LoginRequest) {
  try {
    const data = await loginRequest(fields);

    store.dispatch(setAuthed(true));
  } catch (e) {
    const data = axios.isAxiosError<LoginError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "LoginError",
        message: e instanceof Error ? e.message : "login.error.request",
      },
      message: {error: data?.message},
    };
  }

  try {
    const data = await currentUserRequest();

    store.dispatch(setCurentUser(data.user));
  } catch (e) {
    const data = axios.isAxiosError<CurrentUserError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "CurrentUserError",
        message: e instanceof Error ? e.message : "login.error.request.me",
      },
      message: {error: data?.message},
    };
  }

  return {
    success: true,
    redirectTo: "/",
  };
};
