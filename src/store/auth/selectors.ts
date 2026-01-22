import type { RootState } from "../../store/store";

export const selectAuthed = (state: RootState) => state.auth.authed;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;