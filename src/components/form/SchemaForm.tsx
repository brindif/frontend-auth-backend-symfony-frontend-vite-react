import { useDelete, useTranslate, useUpdate } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Button, Flex, Tag, Card, Avatar, Row, Col } from "antd";
import { FormItemsFromSchema } from "../generator/FormItemsFromSchema";
import { useEffect, useState } from "react";
import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "../../components/routing/RouteChangeConfirm";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteConfirm } from "../Modal";
import { useForm } from "@refinedev/antd";
import { useWarnAboutChange } from "@refinedev/core";
import { DatabaseOutlined } from '@ant-design/icons';
import { selectList } from "../../store/form/selectors";
import { addList } from "../../store/form/slice";
import { useDispatch } from "react-redux";

export function SchemaForm ({ index }: {index: number}) {
  const queryCache = useQueryClient();
  const t = useTranslate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, formProps } = useForm();
  const schemas = useAppSelector((state) => selectList(state, '/schemas'));
  const { warnWhen, setWarnWhen } = useWarnAboutChange();

  // Get API schema
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/schema/{id}', 'put'));
  const [content, setContent] = useState<any>(null);
  const [schema, setSchema] = useState<any>(null);

  // Initialize form values
  useEffect(() => {
    if (!schemas || !schemas[index] || (schema && schema['@id'] === schemas[index]['@id'])) return;
    form.resetFields();
    form.setFieldsValue(schemas[index]);
    setContent(fullSchema ? (
      <FormItemsFromSchema 
        schema={fullSchema} 
        form={schemas[index]['@id']}
      />
    ) : null);
    setSchema(schemas[index]);
  }, [schemas]);

  // Validate form
  const { message } = App.useApp();
  const { mutate: updateQuery } = useUpdate();
  const onFinish = ({ formData }: any) => {
    formData.tabs = formData.tabs.filter((tab:string) => tab != null && tab !== '');
    updateQuery({
      resource: 'schema',
      id: schema.id,
      values: formData,
    }, {
      onSuccess:(data: any) => {
        queryCache.removeQueries({ queryKey: ['/schemas'], exact: true });
        let warn = false;
        dispatch(addList({route: '/schemas', list: schemas.map(child => {
          if (schema['@id'] !== child['@id']) {
            if (!warn && child.edited) warn = true;
            return child;
          }
          return data?.data;
        }) ?? []}));
        if (!warn) setWarnWhen(false);
        setSchema(data?.data);
        message.success(t("content.success", {}, "Content updated successfully"), 10);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "content.error.request", {}, "Error updating content"), 10);
      } 
    });
  };

  // Delete content
  const { showDeleteConfirm } = useDeleteConfirm();
  const { mutate: deleteQuery } = useDelete();
  const onDelete = () => {
    deleteQuery({
      resource: 'schema',
      id: schema.id,
      values: {id: schema.id},
    }, {
      onSuccess:(data: any) => {
        queryCache.removeQueries({ queryKey: ['/schemas'], exact: true });
        message.success(t("content.delete.success", {}, "Content delete successfully"), 10);
        let warn = false;
        dispatch(addList({route: '/schemas', list: schemas.reduce((acc, child) => {
          if (schema['@id'] !== child['@id']) {
            if (!warn && child.edited) warn = true;
            return [...acc, child];
          }
          return acc;
        }, []) ?? []}));
        if (!warn) setWarnWhen(false);
      },
      onError: (error: any) => {
        message.error(t(error?.message ?? "content.delete.error.request", {}, "Error deleting content"), 10);
      } 
    });
  }

  // Set updated field
  const onChange = ({ changedValues, allValues }:any) => {
    if (!warnWhen) {
      setWarnWhen(true);
    }
    if (!schema.edited) {
      dispatch(addList({route: '/schemas', list: schemas.map(child => {
        if (schema['@id'] !== child['@id']) return child;
        return {...schema, edited: true}
      }) ?? []}));
      setSchema({...schema, ...changedValues, edited: true});
    }
  };

  const hiddenFields = fullSchema ? [...Object.keys(fullSchema.properties), '@type', '@id'] : [];

  return (
    <Form
      {...formProps}
      key={`schema_${index}`}
      onValuesChange={(changedValues, allValues) => onChange({ changedValues, allValues })}
      onFinish={(formData) => onFinish({ formData })}
      layout="vertical"
      style={{width: '100%', marginBottom: '10px'}}>
      {schema &&
        <Card title={
          <Flex align="center" gap={10}>
            <Avatar size={28}><DatabaseOutlined /></Avatar>
            { schema.name }
          </Flex>
        } extra={ <Flex align="center" gap={10}>
          <Button htmlType="submit" icon={<SaveOutlined />} type="primary" disabled={!schema.edited} />
          <Button type="primary" onClick={() => showDeleteConfirm(onDelete)} danger icon={<DeleteOutlined />} />
        </Flex> }>
          <Flex align="center" gap={10} wrap>
            { Object.keys(schema).map(field => !hiddenFields.includes(field) &&
              <Tag key={field} color="blue">
                { t(`form.schema.${field}`, {}, field) } :
                { schema[field] }
              </Tag>
            ) }
          </Flex>
          { content }
        </Card>
      }
    </Form>
  );
};
