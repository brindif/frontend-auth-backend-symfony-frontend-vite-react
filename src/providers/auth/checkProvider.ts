import { store } from "../../store/store";
import { selectAuthed } from "../../store/auth/selectors";
import { refreshTokenRequest, RefreshTokenError } from "../../api/auth/refreshTokenApi";
import { currentUserRequest, CurrentUserError } from "../../api/auth/currentUserApi";
import { setAuthed, setCurentUser } from "../../store/auth/slice";

export async function checkProvider() {
  const token = selectAuthed(store.getState());
  if (token) {
    return { success: true };
  }
  //Refresh token if BEARER token is expired
  try {
    const data = await refreshTokenRequest();

    store.dispatch(setAuthed(true));
  } catch (e) {
    //Return false and redirect to login if token cann't be refresh
    return {
      success: false,
      redirectTo: "/login",
    };
  }
  //Access tu user values again after refresh token
  try {
    const data = await currentUserRequest();
    
    store.dispatch(setCurentUser(data.user));
  } catch (e) {
    //Return false and redirect to login
    return {
      success: false,
      redirectTo: "/login",
    };
  }
};
