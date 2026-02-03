import type { RootState } from "../store";

export const selectList = (state: RootState, route: string) => state.form.lists[route] ?? undefined;