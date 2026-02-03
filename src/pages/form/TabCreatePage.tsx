import { useCustom, useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/tab/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/form/FormItemsFromSchema";
import { useDispatch } from "react-redux";
import { setTabs } from "../../store/tab/slice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function TabCreatePage () {
  // Initialize form field
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab', 'post'));

  // Change tabs list in redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shouldRefetchTabs, setShouldRefetchTabs] = useState(false);
  const { query: queryTabs } = useCustom({
    url: '/tabs',
    method: "get",
    queryOptions: {
      enabled: shouldRefetchTabs,
      refetchOnMount: false,
    }
  });
  useEffect(() => {
    if (shouldRefetchTabs && queryTabs.isSuccess && queryTabs.data?.data?.member) {
      dispatch(setTabs(queryTabs.data.data.member));
      setShouldRefetchTabs(false);
      navigate('/');
    }
  }, [queryTabs.isSuccess, queryTabs.data, shouldRefetchTabs]);

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
