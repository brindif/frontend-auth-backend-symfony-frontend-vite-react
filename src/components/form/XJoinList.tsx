import { FormItemsFromSchema } from "./FormItemsFromSchema";
import { ObjectSchema } from "../../utils/form/openApiTypes";
import { Space, Divider } from "antd";
import { useTranslate } from "@refinedev/core";

type XJoinListType = {
  schema: ObjectSchema;
  field: string;
  form?: string,
}

export function XJoinList({ schema, field, form}: XJoinListType) {
  const styles = {
    space: {
      minWidth: '200px',
    }
  }
  const t = useTranslate();
  let number = 0;

  return <Space direction="horizontal">
    <Space direction="vertical" style={styles.space}>
      <Divider orientation="left">{ t(`form.${form ?? "form"}.${field}.num`, {num: number}, `${field} {{num}}`) }</Divider>
      <FormItemsFromSchema schema={schema} form={form} joinList={`${field}[${number}]`} />
    </Space>
  </Space>
}