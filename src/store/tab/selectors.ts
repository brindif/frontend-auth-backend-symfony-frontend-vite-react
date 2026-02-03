import type { RootState } from "../store";

export const selectTabs = (state: RootState) => state.tab.tabs;

export const selectTree = (state: RootState) => state.tab.tree;

export const selectTab = (state: RootState, id: string | undefined) => {
  return state.tab.tabs ? state.tab.tabs.find((tab: any) => Number(tab.id) === Number(id)) : undefined;
};

export const selectCurrentTabs = (state: RootState) => {
  return state.tab.currentTabs
};

export const selectOpenApi = (state: RootState) => state.tab.openApi;

export const selectSchema = (state: RootState, path: string, method: string) => {
    if (!state.tab.openApi)
        return undefined;
    try {
      const requestBody = state.tab.openApi.paths[path][method].requestBody;
      const schemaRef = requestBody.content['application/json'].schema.$ref;
      const schemaName = schemaRef.split("/").pop();
      const fullSchema = state.tab.openApi.components.schemas[schemaName];
      return fullSchema;
    } catch(e) {
      return undefined;
    }
};