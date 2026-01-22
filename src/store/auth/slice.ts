import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CurrentUserType = {
  name: string | null;
  email: string | null;
  roles: Array<string> | [];
}

export type AuthState = {
  authed: boolean;
  currentUser: CurrentUserType | null;
};

const initialState: AuthState = {
  authed: false,
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthed: (state, action: PayloadAction<boolean>) => {
      state.authed = action.payload;
    },
    setCurentUser: (state, action: PayloadAction<CurrentUserType>) => {
      state.currentUser = {
        name: action.payload.name,
        email: action.payload.email,
        roles: action.payload.roles,
      };
      state.authed = true;
    },
    clearAuth: (state) => {
      state.authed = false;
      state.currentUser = null;
    },
  },
});

export const { setAuthed, setCurentUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
