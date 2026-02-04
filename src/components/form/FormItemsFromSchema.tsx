import { Form, Input, InputNumber, Switch, Select } from "antd";
import { useTranslate } from "@refinedev/core";
import { ObjectSchema } from "../../utils/form/openApiTypes";
import { extractFormat } from "../../utils/form/openApiFormat";
import { extractRules } from "../../utils/form/openApiRules";
import { XListSelect } from "./XListSelect";
import { XJoinList } from "./XJoinList";

type FormItemsFromSchemaType = {
  schema: ObjectSchema;
  form?: string,
  joinList?: any[];
}

export function FormItemsFromSchema({ schema, form, joinList}: FormItemsFromSchemaType) {
  const t = useTranslate();
  return (
    <>
      {schema.properties && Object.keys(schema.properties).map((field) => {
        const fieldSchema = schema.properties[field];

        let item = undefined;
        let input = <Input />;
        switch (extractFormat(schema.properties[field])) {
          case "integer":
          case "number":
            input=<InputNumber />
            break;
          case "boolean":
            input=<Switch />
            break;
          case "enum":
            input=<Select options={fieldSchema.enum?.map((value) => ({
              value: t(`form.${form ?? "form"}.${String(value)}`, {}, String(value)),
            }))} />
            break;
          case "join-list":
            if(fieldSchema["x-join"]) {
              const { properties, required } = fieldSchema["x-join"];
              if (typeof properties === "object" && typeof required === "object") {
                item=<XJoinList schema={fieldSchema["x-join"]} form={form} field={field} />
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
          case "string":
            input=<Input placeholder={fieldSchema.example ?? undefined} />
            break;
        }
        return (item ? item :
          <Form.Item
            key={joinList ? joinList.reduce((acc, occ) => `${acc}_${occ}`, field) : field}
            name={joinList ? [...joinList, field] : field}
            label={t(`form.${form ?? "form"}.${field}`, {}, field)}
            rules={extractRules(schema, field, t)}
            valuePropName={extractFormat(fieldSchema) === "boolean" ? "checked" : undefined} 
          >
            { input }
          </Form.Item>);
      })}
    </>
  );
}
