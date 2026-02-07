import { store } from "../../store/store";
import { selectAuthed, selectCurrentUser } from "../../store/auth/selectors";
import { refreshTokenRequest } from "../../api/auth/refreshTokenApi";
import { currentUserRequest } from "../../api/auth/currentUserApi";
import { setAuthed, setCurentUser } from "../../store/auth/slice";
import { CheckResponse } from "@refinedev/core"
import { setOpenApi } from "../../store/form/slice";
import { selectOpenApi } from "../../store/form/selectors";
import { tabsRequest } from "../../api/form/tabsRequest";
import { openApiRequest } from "../../api/form/openApiRequest";

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
  //Load tabs after successful authentication
  /*const tabs = selectTabs(store.getState());
  if (!tabs) {
    try {
      const data = await tabsRequest();
      store.dispatch(setTabs(data));
      // TODO : get first tab from data or from route
      if (data.length > 0) {
        store.dispatch(setCurrentTabs(data.find((tab) => !tab.parent) ?? null));
      }
    } catch (e) {
      //Return false and redirect to login
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  }*/
  return { authenticated: true };
};
