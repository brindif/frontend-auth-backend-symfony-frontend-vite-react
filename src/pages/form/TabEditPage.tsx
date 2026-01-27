import { useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/form/FormItemsFromSchema";
import { useParams } from "react-router-dom";
import { selectTab } from "../../store/form/selectors";
import { useEffect } from "react";


export function TabEditPage () {
  const { id } = useParams();
  const tab = useAppSelector(state => selectTab(state, id));
  const t = useTranslate();
  const { message } = App.useApp();
  
  const { mutate: postQuery } = useCustomMutation();
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab'));

  const [form] = Form.useForm();
  const content = fullSchema ? (
    <FormItemsFromSchema 
      schema={fullSchema} 
      form="tab"
    />
  ) : null;

  useEffect(() => {
    if (!tab || !content) return;
    form.setFieldsValue(tab);
  }, [form, content, tab]);

  const onFinish = ({ formData }: any) => {
    postQuery({
      url: '/tab',
      method: "put",
      values: formData
    }, {
      onSuccess:(data: any) => {
        message.success(t("admin.tab.success", {}, "Tab updated successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "admin.tab.error.request", {}, "Error updating tab"), 10);
      } 
    });
  };

  return (
    <Form
      form={form}
      className="content"
      onFinish={(formData) => onFinish({ formData })}
      layout="vertical">
      <Typography.Title level={3}>
        { t("admin.tab.title", {}, "Edit Tab") }
        { tab && ' '+t(tab?.name, {}, tab?.defaultName) }
      </Typography.Title>

      { content }

      <Form.Item>
        <Button type="primary" htmlType="submit">{ t("admin.tab.submit", {}, "Submit") }</Button>
      </Form.Item>
    </Form>
  );
};
