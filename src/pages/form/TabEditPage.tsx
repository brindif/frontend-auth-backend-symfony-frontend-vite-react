import { useCustom, useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "../../components/form/FormItemsFromSchema";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearTabs } from "../../store/tab/slice";
import { clearList } from "../../store/form/slice";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { selectTabs } from "../../store/tab/selectors";
import { getTab } from "../../utils/tab/manageTab";

export function TabEditPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  
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
  const tabs = useAppSelector(selectTabs);
  useEffect(() => {
    const tab =  getTab(tabs, `/api/tab/${id}`);
    form.setFieldsValue(tab);
  }, [tabs, id]);

  // Change tabs list in redux
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
        navigate(`/`);
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
