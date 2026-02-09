import { useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button } from "antd";
import { FormItemsFromSchema } from "./FormItemsFromSchema";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setContents } from "../../store/tab/slice";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ElementType, ContentType, MethodType } from "../../store/tab/slice";
import { selectContents } from "../../store/tab/selectors";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  index: number;
  element: ContentType;
};

export function ContentForm ({ index, element }: Props) {
  const queryCache = useQueryClient();
  const navigate = useNavigate();
  const id = element.values && element.values.id ? element.values.id : null;
  const url = element.path.replace('{id}', id);
  const contents = useAppSelector(selectContents);
  
  // Initialize form field
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, `/api${element.path}`, element.method));
  const [form] = Form.useForm();
  const content = fullSchema ? (
    <FormItemsFromSchema 
      schema={fullSchema} 
      form={`${element.type}-${index}`}
    />
  ) : null;

  // Initialize form values
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(element.values);
  }, [element.values]);

  // Change contents list in redux
  const dispatch = useDispatch();
  const [refreshContent, setRefreshContent] = useState<any>(false);
  useEffect(() => {
    if (refreshContent) {
      dispatch(setContents(contents.reduce((acc:ContentType[], content:ContentType, currentIndex: number ) => {
        if (currentIndex !== index) {
          return [ ...acc, content ];
        }
        // Method delete - remove
        else if (refreshContent?.method === MethodType.DELETE) {
          return acc;
        }
        // Method post - change to put, save values
        else if (content.method === MethodType.POST) {
          return [
            ...acc,
            {
              ...content,
              method: MethodType.PUT,
              values: refreshContent,
              path: `${content.path}/{id}`,
              position: refreshContent?.position,
              updated: false,
            }
          ];
        }
        // Method put - save values and remove if tab changed
        else if (element.method === MethodType.PUT || element.method === MethodType.PATCH) {
          if (refreshContent?.tab !== element.values?.tab) {
            return acc;
          }
          return [ ...acc, { ...content, position: refreshContent?.position ?? 0, values: refreshContent } ];
        }
        return acc;
      }, []).sort((a:ContentType, b:ContentType) => (a.position ?? 0) - (b.position ?? 0))));
      setRefreshContent(false);
    }
  }, [refreshContent]);

  // Validate form
  const t = useTranslate();
  const { message } = App.useApp();
  const { mutate: postQuery } = useCustomMutation();
  const onFinish = ({ formData }: any) => {
    postQuery({
      url: url,
      method: element.method,
      values: formData
    }, {
      onSuccess:(data: any) => {
        setRefreshContent(data?.data);
        queryCache.removeQueries({ queryKey: [element.list], exact: true });
        form.resetFields();
        message.success(t("content.success", {}, "Content updated successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "content.error.request", {}, "Error updating content"), 10);
      } 
    });
  };

  // Detele content
  const onDelete = () => {
    postQuery({
      url: url,
      method: "delete",
      values: {id: id},
    }, {
      onSuccess:(data: any) => {
        setRefreshContent({method: MethodType.DELETE});
        queryCache.removeQueries({ queryKey: [element.list], exact: true });
        message.success(t("content.delete.success", {}, "Content delete successfully"), 10);
        navigate(`/`);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "content.delete.error.request", {}, "Error deleting content"), 10);
      } 
    });
  }

  return (
    <Form
      key={`${element.type}-${element.method}-${index}`}
      form={form}
      onFinish={(formData) => onFinish({ formData })}
      layout="vertical">
      <Typography.Title level={3}>
        { t(`content.${element.type}.${element.method}`, {}, `${element.method} ${element.type}`) }
      </Typography.Title>

      { content }

      <Typography className="button">
        <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
          { t("content.button.submit", {}, "Submit") }
        </Button>
        { element.method === MethodType.PUT &&
          <Button type="primary" onClick={() => onDelete()} danger icon={<DeleteOutlined />}>
            { t("content.button.delete", {}, "Delete") }
          </Button>
        }
      </Typography>
    </Form>
  );
};
