import { useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/form/FormItemsFromSchema";

export function TabCreatePage () {
  const t = useTranslate();
  const { message } = App.useApp();
  
  const { mutate: postQuery } = useCustomMutation();
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab'));

  const onFinish = ({ formData }: any) => {
    postQuery({
      url: '/tab',
      method: "post",
      values: formData
    }, {
      onSuccess:(data: any) => {
        message.success(t("admin.tab.success", {}, "Tab created successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "admin.tab.error.request", {}, "Error creating tab"), 10);
      } 
    });
  };

  return (
    <Form className="content" onFinish={(formData) => onFinish({ formData })} layout="vertical">
      <Typography.Title level={3}>{ t("admin.tab.title", {}, "Create Tab") }</Typography.Title>

      {fullSchema &&
        <FormItemsFromSchema
          schema={fullSchema}
          form="tab" />}

      <Form.Item>
        <Button type="primary" htmlType="submit">{ t("admin.tab.submit", {}, "Submit") }</Button>
      </Form.Item>
    </Form>
  );
};
