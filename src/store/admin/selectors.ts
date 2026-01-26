import type { RootState } from "../../store/store";

export const selectOpenApi = (state: RootState) => state.admin.openApi;

export const selectSchema = (state: RootState, path: string) => {
    if (!state.admin.openApi)
        return undefined;

    const requestBody = state.admin.openApi.paths[path].post.requestBody;
    const schemaRef = requestBody.content['application/json'].schema.$ref;
    const schemaName = schemaRef.split("/").pop();
    const fullSchema = state.admin.openApi.components.schemas[schemaName];
    return fullSchema;
};