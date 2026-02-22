import { useCustom, useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/generator/FormItemsFromSchema";
import { useDispatch } from "react-redux";
import { clearTabs } from "../../store/tab/slice";
import { clearList } from "../../store/form/slice";
import { useState, useEffect } from "react";
import { useNavigate } from "../../components/routing/RouteChangeConfirm";
import { useForm } from "@refinedev/antd";

export function TabCreatePage () {
  // Initialize form field
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab', 'post'));
  const { form, formProps } = useForm();

  // Change tabs list in redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shouldRefetchTabs, setShouldRefetchTabs] = useState(false);
  useEffect(() => {
    if (shouldRefetchTabs) {
      dispatch(clearTabs());
      dispatch(clearList('/tabs'));
      setShouldRefetchTabs(false);
    }
  }, [shouldRefetchTabs]);

  // Validate form
  const t = useTranslate();
  const { message } = App.useApp();
  const { mutate: postQuery } = useCustomMutation();
  const onFinish = ({ formData }: any) => {
    postQuery({
      url: '/tab',
      method: "post",
      values: formData
    }, {
      onSuccess:(data: any) => {
        setShouldRefetchTabs(true);
        message.success(t("admin.tab.success", {}, "Tab created successfully"), 10);
        navigate(`/form/tab/${data.data.id}`);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "admin.tab.error.request", {}, "Error creating tab"), 10);
      } 
    });
  };

  return (
    <Form {...formProps} className="content" onFinish={(formData) => onFinish({ formData })} layout="vertical">
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
