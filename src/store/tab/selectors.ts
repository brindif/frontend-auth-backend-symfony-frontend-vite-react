import type { RootState } from "../store";

export const selectTabs = (state: RootState) => state.tab.tabs;

export const selectCurrentTabs = (state: RootState) => state.tab.currentTabs;

export const selectOpenTabs = (state: RootState) => state.tab.openTabs;