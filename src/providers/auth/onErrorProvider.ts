
import { OnErrorResponse } from "@refinedev/core"

export async function onErrorProvider(error: any): Promise<OnErrorResponse> {
  if (error?.message){
    return {
      error: {
        name: "AuthProviderError",
        message: error?.message
      }
    };
  }
  return {};
};
