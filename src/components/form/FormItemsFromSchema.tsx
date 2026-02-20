import { ObjectSchema } from "../../utils/form/openApiTypes";
import { FormItemFromSchema } from "./FormItemFromSchema";

type FormItemsFromSchemaType = {
  schema: ObjectSchema;
  form?: string,
  joinList?: any[];
}

export function FormItemsFromSchema({ schema, form, joinList}: FormItemsFromSchemaType) {
  return (
    <>
      {schema.properties && Object.keys(schema.properties).map((field) => {
        return <FormItemFromSchema
          joinList={joinList}
          form={form}
          fieldSchema={schema.properties[field]}
          field={field}
          key={field}
          required={schema.required ? schema.required.includes(field) : false}
        />
      })}
    </>
  );
}
