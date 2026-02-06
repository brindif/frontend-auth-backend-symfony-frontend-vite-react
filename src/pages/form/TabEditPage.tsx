import { useCustom, useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/tab/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/form/FormItemsFromSchema";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTabs } from "../../store/tab/slice";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";

export function TabEditPage () {
  const { id } = useParams();
  
  // Initialize form field
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab/{id}', 'put'));
  const [form] = Form.useForm();
  const content = fullSchema ? (
    <FormItemsFromSchema 
      schema={fullSchema} 
      form="tab"
    />
  ) : null;

  // Initialize form values
  const [isTabLoaded, setIsTabLoaded] = useState(false);
  let tab = undefined;
  const { query: queryTab } = useCustom({
    url: `/tab/${id}`,
    method: "get",
    queryOptions: { enabled: !isTabLoaded, refetchOnMount: false }
  });
  useEffect(() => {
    if (!isTabLoaded && queryTab.isSuccess && Number(id) === Number(queryTab.data?.data?.id)) {
      setIsTabLoaded(true);
      tab = queryTab.data?.data;
      form.setFieldsValue(tab);
    }
  }, [isTabLoaded, queryTab, id]);

  // Change tabs list in redux
  const dispatch = useDispatch();
  const [shouldRefetchTabs, setShouldRefetchTabs] = useState(false);
  const { query: queryTabs } = useCustom({
    url: '/tabs',
    method: "get",
    queryOptions: { enabled: shouldRefetchTabs, refetchOnMount: false }
  });
  useEffect(() => {
    if (shouldRefetchTabs && queryTabs.isSuccess && queryTabs.data?.data?.member) {
      dispatch(setTabs(queryTabs.data.data.member));
      setShouldRefetchTabs(false);
    }
  }, [queryTabs.isSuccess, queryTabs.data, dispatch, shouldRefetchTabs]);

  // Validate form
  const t = useTranslate();
  const { message } = App.useApp();
  const { mutate: postQuery } = useCustomMutation();
  const onFinish = ({ formData }: any) => {
    postQuery({
      url: `/tab/${id}`,
      method: "put",
      values: formData
    }, {
      onSuccess:(data: any) => {
        setShouldRefetchTabs(true);
        message.success(t("tab.success", {}, "Tab updated successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "tab.error.request", {}, "Error updating tab"), 10);
      } 
    });
  };

  // Detele tab
  const onDelete = () => {
    postQuery({
      url: `/tab/${id}`,
      method: "delete",
      values: {id: id},
    }, {
      onSuccess:(data: any) => {
        setShouldRefetchTabs(true);
        message.success(t("tab.delete.success", {}, "Tab delete successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "tab.delete.error.request", {}, "Error deleting tab"), 10);
      } 
    });
  }

  return (
    <Form
      form={form}
      className="content"
      onFinish={(formData) => onFinish({ formData })}
      layout="vertical">
      <Typography.Title level={3}>
        { t("tab.title", {}, "Edit Tab") }
      </Typography.Title>

      { content }

      <Typography className="button">
        <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
          { t("tab.button.submit", {}, "Submit") }
        </Button>
        <Button type="primary" onClick={() => onDelete()} danger icon={<DeleteOutlined />}>
          { t("tab.button.delete", {}, "Delete") }
        </Button>
      </Typography>
    </Form>
  );
};
