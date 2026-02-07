import type { RootState } from "../store";

export const selectTabs = (state: RootState) => state.tab.tabs;

export const selectCurrentTabs = (state: RootState) => {
  return state.tab.currentTabs
};