import type { RootState } from "../store";

export const selectList = (state: RootState, route: string) => state.form.lists[route] ?? undefined;

export const selectOpenApi = (state: RootState) => state.form.openApi;

export const selectSchema = (state: RootState, path: string, method: string) => {
  if (!state.form.openApi)
    return undefined;
  try {
    const requestBody = state.form.openApi.paths[path][method].requestBody;
    const ContentRef = requestBody.content[method === 'patch' ? 'application/merge-patch+json' : 'application/json'];
    const schemaRef = ContentRef.schema.$ref;
    const schemaName = schemaRef.split("/").pop();
    const fullSchema = state.form.openApi.components.schemas[schemaName];
    return fullSchema;
  } catch(e) {
    return undefined;
  }
};