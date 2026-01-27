import { ObjectSchema } from "./openApiTypes";
import { extractFormat } from "./openApiFormat";
import type { Rule as RuleType } from "antd/es/form";

export function extractRules(schema:ObjectSchema, field:string, t:any): RuleType[] {
  let rules:RuleType[]=[];

  // Requeired rule
  if(schema.required && schema.required.includes(field)) {
    rules.push({ required: true, message: t("form.error.required", {}, "Required") });
    rules.push({ whitespace: true, message: t("form.error.whitespace", {}, "Not blank") });
  }

  const format = extractFormat(schema.properties[field]);
  const fieldSchema = schema.properties[field];
  if (!format || !fieldSchema) {
    return rules;
  }

  // Number rules
  if(format === "integer" || format === "number") {
    rules.push({
      type: "number",
      min: fieldSchema.minimum,
      max: fieldSchema.maximum,
      message: fieldSchema.minimum && fieldSchema.maximum ? t("form.error.minmax", {min: fieldSchema.minimum, max: fieldSchema.maximum}, `Minimum is {{min}}, Maximum is {{max}}`) : (
        fieldSchema.minimum ? t("form.error.min", {min: fieldSchema.minimum}, `Minimum is {{min}}`) : (
          fieldSchema.maximum ? t("form.error.max", {max: fieldSchema.maximum}, `Maximum is {{max}}`) : (
            t("form.error.number", {}, "Must be a number")
          )
        )
      )
    });
  }

  // String rules
  if(format === "string" && (fieldSchema.minLength || fieldSchema.maxLength)) {
    rules.push({
      type: "string",
      min: fieldSchema.minLength,
      max: fieldSchema.maxLength,
      message: fieldSchema.minLength && fieldSchema.maxLength ? t("form.error.minmaxlen", {min: fieldSchema.minLength, max: fieldSchema.maxLength}, `At least {{min}}, at most {{max}} characters`) : (
        fieldSchema.minLength ? t("form.error.minlen", {min: fieldSchema.minLength}, `At least {{min}} characters`) : (
          t("form.error.maxlen", {max: fieldSchema.maxLength}, `At most {{max}} characters`)
        )
      )
    });
  }

  // Rules from OpenAPI format
  const formatRule = getOpenApiFormatPattern(format, t);
  if(formatRule) {
    rules.push(formatRule);
  }
  
  if(format === "string") {
    rules.push({transform: (value) => value?.toString().trim() });
  }
  
  return rules;
}

function getOpenApiFormatPattern(format:string, t: any):RuleType | null {
  switch(format) {
    case "email":
    case "idn-email":
      return { type: "email", message: t("form.error.email", {}, "Invalid email format") };
    case "uri":
    case "iri":
    case "idn-hostname":
    case "uri-reference":
      return { type: "url", message: t("form.error.url", {}, "Invalid URL format") };
    case "date":
      return { type: "date", message: t("form.error.date", {}, "Invalid date format") };
    case "date-time":
      return { pattern: /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?(Z|[+-]\\d{2}:\\d{2})?$/, message: t("form.error.format", {}, "Invalid format") };
    case "ipv4":
    case "ipv6":
      return { pattern: /^(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}$/, message: t("form.error.format", {}, "Invalid format") };
    case "uuid":
      return { pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, message: t("form.error.format", {}, "Invalid format") };
    case "json-pointer":
      return { pattern: /^[0-9]+\/[a-z\-]+$/, message: t("form.error.format", {}, "Invalid format") };
    case "relative-json-pointer":
      return { pattern: /^\/[a-z\-]+\/[0-9]+\/[a-z\-]+$/, message: t("form.error.format", {}, "Invalid format") };
    case "iri-reference":
      return { pattern: /^(\/[a-z\-]+)+\/[0-9]+$/, message: t("form.error.format", {}, "Invalid format") };
  }
  return null;
}