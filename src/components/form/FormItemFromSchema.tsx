import { Form, Input, InputNumber, Switch, Select } from "antd";
import { useTranslate } from "@refinedev/core";
import { OpenApiElement } from "../../utils/form/openApiTypes";
import { extractFormat } from "../../utils/form/openApiFormat";
import { extractRules } from "../../utils/form/openApiRules";
import { XListSelect } from "./XListSelect";
import { XJoinList } from "./XJoinList";
import Editor from "../note/Editor";
import { XArray } from "./XArray";

type FormItemFromSchemaType = {
  fieldSchema: OpenApiElement;
  form?: string,
  field?: string,
  required?: boolean,
  joinList?: any[];
  restField?: { fieldKey?: number | undefined; };
}

export function FormItemFromSchema({ fieldSchema, form, field, required=false, joinList, restField={}}: FormItemFromSchemaType) {
  const t = useTranslate();

  let item = undefined;
  let input = <Input />;
  switch (extractFormat(fieldSchema)) {
    case "integer":
    case "number":
      input=<InputNumber />
      break;
    case "boolean":
      input=<Switch />
      break;
    case "enum":
      input=<Select options={fieldSchema.enum?.map((value) => ({
        value: String(value),
        label: t(`form.${form ?? "form"}.${String(value)}`, {}, String(value)),
      }))} />
      break;
    case "array":
      if(fieldSchema["x-array"] && field) {
        const { type } = fieldSchema["x-array"];
        if (type) {
          item=<XArray
            key={joinList ? joinList.reduce((acc, occ) => `${acc}_${occ}`, field) : field}
            schema={fieldSchema["x-array"]}
            form={form}
            field={field} />
        }
      }
      break;
    case "join-list":
      if(fieldSchema["x-join"] && field) {
        const { properties, required } = fieldSchema["x-join"];
        if (typeof properties === "object" && typeof required === "object") {
          item=<XJoinList
            key={joinList ? joinList.reduce((acc, occ) => `${acc}_${occ}`, field) : field}
            schema={fieldSchema["x-join"]}
            form={form}
            field={field} />
        }
      }
      break;
    case "iri-reference":
      if(fieldSchema["x-list"]) {
        const { route, label, identifier } = fieldSchema["x-list"];
        if (typeof route === "string" && typeof label === "string" && typeof identifier === "string") {
          input = <XListSelect xList={fieldSchema["x-list"]} />;
          break;
        }
      }
    case "editor":
      input=<Editor />;
      break;
    case "string":
      input=<Input placeholder={fieldSchema.example ?? undefined} />;
      break;
  }
  const key = ( field || 'field' )+(
    joinList ? joinList.reduce((acc, occ) => `${acc}_${occ}`, '_') : ''
  )+(
    restField ? Object.values(restField).reduce((acc, occ) => `${acc}_${occ}`, '_') : ''
  );

  return (item ? item :
    <Form.Item
      {...(field ? {
        name: joinList ? [...joinList, field] : field,
        label: t(`form.${form ?? "form"}.${field}`, {}, field),
      } : {...restField, name: restField.fieldKey})}
      key={key}
      rules={extractRules(fieldSchema, required, t)}
      valuePropName={extractFormat(fieldSchema) === "boolean" ? "checked" : undefined} 
    >
      { input }
    </Form.Item>);
}
