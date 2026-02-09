import axios from "axios";
import { AuthActionResponse } from "@refinedev/core"
import { store } from "../../store/store";
import { loginRequest, LoginRequest, LoginError } from "../../api/auth/loginApi";
import { currentUserRequest, CurrentUserError } from "../../api/auth/currentUserApi";
import { setAuthed, setCurentUser } from "../../store/auth/slice";
import { clearTabs } from "../../store/tab/slice";
import { selectOpenApi } from "../../store/form/selectors";
import { openApiRequest } from "../../api/form/openApiRequest";
import { setOpenApi } from "../../store/form/slice";

export async function loginProvider(fields: LoginRequest): Promise<AuthActionResponse> {
  try {
    const data = await loginRequest(fields);

    store.dispatch(setAuthed(true));
    store.dispatch(clearTabs());
  } catch (e) {
    const data = axios.isAxiosError<LoginError>(e) ? e.response?.data : undefined;
    return {
      success: false,
      error: {
        name: "LoginError",
        message: data?.message ?? "login.error.request",
      },
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
        message: data?.message ?? "login.error.request.me",
      },
    };
  }

  //Load OpenApi schema after successful authentication
  const api = selectOpenApi(store.getState());
  if (!api) {
    try {
      const data = await openApiRequest();
      store.dispatch(setOpenApi(data));
    } catch (e) {
      //Return false and redirect to login
      return {
        success: false,
        error: {
          name: "CurrentUserError",
          message: "login.error.openapi",
        },
      };
    }
  }

  return {
    success: true,
    redirectTo: "/",
  };
};
