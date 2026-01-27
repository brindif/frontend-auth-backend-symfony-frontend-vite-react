import type { RootState } from "../store";

export const selectTabs = (state: RootState) => state.form.tabs;

export const selectTree = (state: RootState) => state.form.tree;

export const selectTab = (state: RootState, id: string | undefined) => {
  return state.form.tabs ? state.form.tabs.find((tab: any) => Number(tab.id) === Number(id)) : undefined;
};

export const selectCurrentTabs = (state: RootState) => {
  return state.form.currentTabs
};

export const selectOpenApi = (state: RootState) => state.form.openApi;

export const selectSchema = (state: RootState, path: string, method: string) => {
    if (!state.form.openApi)
        return undefined;
    try {
      const requestBody = state.form.openApi.paths[path][method].requestBody;
      const schemaRef = requestBody.content['application/json'].schema.$ref;
      const schemaName = schemaRef.split("/").pop();
      const fullSchema = state.form.openApi.components.schemas[schemaName];
      return fullSchema;
    } catch(e) {
      return undefined;
    }
};