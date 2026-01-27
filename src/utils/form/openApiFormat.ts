import { OpenApiElement } from "./openApiTypes";

export function extractFormat(fieldSchema:OpenApiElement): string | undefined {
    if(fieldSchema.enum)
        return "enum";
    if(fieldSchema.format)
        return fieldSchema.format;
    if(Array.isArray(fieldSchema.type))
        return fieldSchema.type.find((x) => x !== "null")
    if(typeof fieldSchema.type === "string")
        return fieldSchema.type;
    return undefined;
}