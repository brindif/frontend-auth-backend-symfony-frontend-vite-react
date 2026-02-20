import { FormItemFromSchema } from "./FormItemFromSchema";
import { OpenApiElement } from "../../utils/form/openApiTypes";
import { Space, Divider, Form, Button } from "antd";
import { useTranslate } from "@refinedev/core";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDeleteConfirm } from "../Modal";

type XArray = {
  schema: OpenApiElement;
  field: string;
  form?: string,
}

export function XArray({ schema, field, form}: XArray) {
  const styles = {
    space: {
      minWidth: '200px',
      padding: '10px',
    }
  }
  const t = useTranslate();
  let number = 1;
  const { showDeleteConfirm } = useDeleteConfirm();

  return <Form.Item label={t(`form.${form ?? "form"}.${field}`, {}, field)} noStyle>
    <Form.List name={field}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={`${field}/${key}`} direction="vertical" style={styles.space}>
              <FormItemFromSchema fieldSchema={schema} form={form} restField={restField} />
              <Button type="dashed" onClick={() => showDeleteConfirm(() => remove(name))} icon={<MinusCircleOutlined />} />
            </Space>
          ))}
          <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} />
        </>
      )}
    </Form.List>
  </Form.Item>;
}