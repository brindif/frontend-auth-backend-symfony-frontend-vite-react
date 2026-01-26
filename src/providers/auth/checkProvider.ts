import { store } from "../../store/store";
import { selectAuthed, selectCurrentUser } from "../../store/auth/selectors";
import { refreshTokenRequest, RefreshTokenError } from "../../api/auth/refreshTokenApi";
import { currentUserRequest, CurrentUserError } from "../../api/auth/currentUserApi";
import { setAuthed, setCurentUser } from "../../store/auth/slice";
import { CheckResponse } from "@refinedev/core"
import { setOpenApi } from "../../store/admin/slice";
import { openApiRequest, OpenApiError } from "../../api/admin/openApiRequest";
import { selectOpenApi } from "../../store/admin/selectors";

export async function checkProvider(): Promise<CheckResponse> {
  const token = selectAuthed(store.getState());
  if (token) {
    return { authenticated: true };
  }
  //Refresh token if BEARER token is expired
  try {
    const data = await refreshTokenRequest();

    store.dispatch(setAuthed(true));
  } catch (e) {
    //Return false and redirect to login if token cann't be refresh
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  }
  //Access tu user values again after refresh token
  const user = selectCurrentUser(store.getState());
  if (!user) {
    try {
      const data = await currentUserRequest();
      
      store.dispatch(setCurentUser(data.user));
    } catch (e) {
      //Return false and redirect to login
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
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
        authenticated: false,
        redirectTo: "/login",
      };
    }
  }
  return { authenticated: true };
};
