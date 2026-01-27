import { useCustom, useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/form/FormItemsFromSchema";
import { useParams } from "react-router-dom";
import { selectTab } from "../../store/form/selectors";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTabs } from "../../store/form/slice";

export function TabEditPage () {
  const { id } = useParams();
  const tab = useAppSelector(state => selectTab(state, id));
  const t = useTranslate();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  
  const { mutate: postQuery } = useCustomMutation();
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab/{id}', 'put'));

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

  const [shouldRefetchTabs, setShouldRefetchTabs] = useState(false);
  const { query: queryTabs } = useCustom({ url: '/tabs', method: "get", queryOptions: { enabled: shouldRefetchTabs } });
  useEffect(() => {
    if (queryTabs.isSuccess && queryTabs.data?.data?.member) {
      dispatch(setTabs(queryTabs.data.data.member));
      setShouldRefetchTabs(false);
    }
  }, [queryTabs.isSuccess, queryTabs.data, dispatch]);

  const onFinish = ({ formData }: any) => {
    postQuery({
      url: `/tab/${id}`,
      method: "put",
      values: formData
    }, {
      onSuccess:(data: any) => {
        setShouldRefetchTabs(true);
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
