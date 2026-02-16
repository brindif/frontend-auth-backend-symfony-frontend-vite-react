import { useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Typography, Button, Flex, Tag } from "antd";
import { FormItemsFromSchema } from "./FormItemsFromSchema";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setContents } from "../../store/tab/slice";
import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "../../components/routing/RouteChangeConfirm";
import { ElementType, ContentType, MethodType } from "../../store/tab/slice";
import { selectContents } from "../../store/tab/selectors";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteConfirm, useUnsavedConfirm } from "../Modal";
import { useForm } from "@refinedev/antd";
import { useWarnAboutChange } from "@refinedev/core";

type Props = {
  index: number;
  element: ContentType;
};

export function ContentForm ({ index, element }: Props) {
  const queryCache = useQueryClient();
  const t = useTranslate();
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const id = element.values && element.values.id ? element.values.id : null;
  const contents = useAppSelector(selectContents);
  const { form } = useForm();

  // Initialize form field
  const getPath = (method:string|undefined = undefined) => {
    switch (method ?? element.method) {
      case MethodType.POST: return `/api${element.post}`;
      case MethodType.PUT: return `/api${element.put}`;
      case MethodType.PATCH: return `/api${element.patch}`;
      default: return '';
    }
  };
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, getPath(), element.method));
  const content = fullSchema ? (
    <FormItemsFromSchema 
      schema={fullSchema} 
      form={`${element.type}-${index}`}
    />
  ) : null;

  // Initialize form values
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(element.values ?? {});
  }, [element.values]);

  // Initialize for Patch method
  const [tags, setTags] = useState<null|Record<string, string>>(null);
  const tagsSchema = useAppSelector((state: RootState) => selectSchema(state, getPath(MethodType.PUT), MethodType.PUT));
  useEffect(() => {
    if (element.method === MethodType.PATCH && tagsSchema) {
      setTags(Object.keys(tagsSchema.properties).reduce((acc, attr) => {
        if (['nameDefault', 'position', 'tab'].includes(attr) || !element.values || !element.values[attr]) return acc;
        if (attr === 'name') return { ...acc, name: t(element.values.name, {}, element.values.nameDefault ?? undefined) };
        return { ...acc, [attr]: element.values[attr] };
      }, {}));
    } else {
      setTags(null);
    }
  }, [element]);

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
              method: MethodType.PATCH,
              values: refreshContent,
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
  const { message } = App.useApp();
  const { mutate: postQuery } = useCustomMutation();
  const getUrl = () => {
    switch (element.method) {
      case MethodType.POST: return element.post;
      case MethodType.PUT: return element.put.replace('{id}', id);
      case MethodType.PATCH: return element.patch.replace('{id}', id);
      default: return '';
    }
  };
  const onFinish = ({ formData }: any) => {
    postQuery({
      url: getUrl(),
      method: element.method,
      values: formData
    }, {
      onSuccess:(data: any) => {
        setRefreshContent(data?.data);
        queryCache.removeQueries({ queryKey: [element.get], exact: true });
        form.resetFields();
        message.success(t("content.success", {}, "Content updated successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "content.error.request", {}, "Error updating content"), 10);
      } 
    });
  };

  // Delete content
  const { showDeleteConfirm } = useDeleteConfirm();
  const onDelete = () => {
    postQuery({
      url: getUrl(),
      method: "delete",
      values: {id: id},
    }, {
      onSuccess:(data: any) => {
        setRefreshContent({method: MethodType.DELETE});
        queryCache.removeQueries({ queryKey: [element.get], exact: true });
        message.success(t("content.delete.success", {}, "Content delete successfully"), 10);
        navigate(`/`);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "content.delete.error.request", {}, "Error deleting content"), 10);
      } 
    });
  }

  // Set to edit mode
  const { showUnsavedConfirm } = useUnsavedConfirm();
  const handdleEdit = () => {
    if (element.method === MethodType.PATCH) {
      form.resetFields();
      dispatch(setContents(contents.reduce((acc:ContentType[], content:ContentType, currentIndex: number ) => {
        if (currentIndex !== index) return [ ...acc, content ];
        return [ ...acc, { ...content, method: MethodType.PUT, updated: false } ];
      }, [])));
      form.setFieldsValue(element.values ?? {});
    } else if (element.method === MethodType.PUT) {
      form.resetFields();
      dispatch(setContents(contents.reduce((acc:ContentType[], content:ContentType, currentIndex: number ) => {
        if (currentIndex !== index) return [ ...acc, content ];
        return [ ...acc, { ...content, method: MethodType.PATCH, updated: false } ];
      }, [])));
      form.setFieldsValue(element.values ?? {});
    }
  };

  // Set updated field
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const onChange = ({ changedValues, allValues }:any) => {
    if (!warnWhen) {
      setWarnWhen(true);
    }
    if (!element.updated) {
      dispatch(setContents(contents.reduce((acc:ContentType[], content:ContentType, currentIndex: number ) => {
        if (currentIndex !== index) return [ ...acc, content ];
        return [ ...acc, { ...content, updated: true } ];
      }, [])));
    }
  }

  return (
    <Form
      key={`${element.type}-${element.method}-${index}`}
      form={form}
      onValuesChange={(changedValues, allValues) => onChange({ changedValues, allValues })}
      onFinish={(formData) => onFinish({ formData })}
      layout="vertical">
      <Flex justify="space-between" align="baseline" gap={8} wrap="wrap">
        <Flex gap={10} wrap="wrap" align="baseline">
          {!tags &&
            <Typography.Title level={3}>
              { t(`content.${element.type}.${element.method}`, {}, `${element.method} ${element.type}`) }
            </Typography.Title>
          }
          { tags && Object.keys(tags).map((attr:string) => (
            <Tag color="blue" key={attr}>{tags[attr]}</Tag>
          ))}
          { element.method !== MethodType.POST &&
            <Button shape="circle" onClick={
              () => element.updated ? showUnsavedConfirm(handdleEdit) : handdleEdit()
            } size="small" icon={<EditOutlined />} />
          }
        </Flex>
        <Flex gap={10} wrap="wrap">
          <Button disabled={!element.updated} type="primary" icon={<SaveOutlined />} htmlType="submit" />
          { element.method === MethodType.PUT &&
            <Button type="primary" onClick={() => showDeleteConfirm(onDelete)} danger icon={<DeleteOutlined />} />
          }
        </Flex>
      </Flex>
      { content }
    </Form>
  );
};
