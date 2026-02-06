import { FormItemsFromSchema } from "./FormItemsFromSchema";
import { ObjectSchema } from "../../utils/form/openApiTypes";
import { Space, Divider, Form, Button } from "antd";
import { useTranslate } from "@refinedev/core";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

type XJoinListType = {
  schema: ObjectSchema;
  field: string;
  form?: string,
}

export function XJoinList({ schema, field, form}: XJoinListType) {
  const styles = {
    space: {
      minWidth: '200px',
      padding: '10px',
    }
  }
  const t = useTranslate();
  let number = 1;

  return <Form.Item label="Permissions">
    <Form.List name="permissions">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={`${field}/${key}`} direction="vertical" style={styles.space}>
              <FormItemsFromSchema schema={schema} form={form} joinList={[name]} />
              <Button type="dashed" onClick={() => remove(name)} icon={<MinusCircleOutlined />} />
            </Space>
          ))}
          <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} />
        </>
      )}
    </Form.List>
  </Form.Item>;
}