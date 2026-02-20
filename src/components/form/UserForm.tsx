import { useDelete, useTranslate, useUpdate } from "@refinedev/core";
import { selectSchema } from '../../store/form/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App, Form, Button, Flex, Tag, Card, Avatar, Row, Col } from "antd";
import { FormItemsFromSchema } from "./FormItemsFromSchema";
import { useEffect, useState } from "react";
import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "../../components/routing/RouteChangeConfirm";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteConfirm } from "../Modal";
import { useForm } from "@refinedev/antd";
import { useWarnAboutChange } from "@refinedev/core";
import { FiUser } from "react-icons/fi";
import { selectList } from "../../store/form/selectors";
import { addList } from "../../store/form/slice";
import { useDispatch } from "react-redux";

export function UserForm ({ index }: {index: number}) {
  const queryCache = useQueryClient();
  const t = useTranslate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, formProps } = useForm();
  const users = useAppSelector((state) => selectList(state, '/users'));
  const { warnWhen, setWarnWhen } = useWarnAboutChange();

  // Get API schema
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/user/{id}', 'put'));
  const [content, setContent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Initialize form values
  useEffect(() => {
    if (!users || !users[index] || (user && user['@id'] === users[index]['@id'])) return;
    form.resetFields();
    form.setFieldsValue(users[index]);
    setContent(fullSchema ? (
      <FormItemsFromSchema 
        schema={fullSchema} 
        form={users[index]['@id']}
      />
    ) : null);
    setUser(users[index]);
  }, [users]);

  // Validate form
  const { message } = App.useApp();
  const { mutate: updateQuery } = useUpdate();
  const onFinish = ({ formData }: any) => {
    formData.roles = formData.roles.filter((role:string) => role != null && role !== '');
    updateQuery({
      resource: 'user',
      id: user.id,
      values: formData,
    }, {
      onSuccess:(data: any) => {
        queryCache.removeQueries({ queryKey: ['/users'], exact: true });
        let warn = false;
        dispatch(addList({route: '/users', list: users.map(child => {
          if (user['@id'] !== child['@id']) {
            if (!warn && child.edited) warn = true;
            return child;
          }
          return data?.data;
        }) ?? []}));
        if (!warn) setWarnWhen(false);
        setUser(data?.data);
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
      resource: 'user',
      id: user.id,
      values: {id: user.id},
    }, {
      onSuccess:(data: any) => {
        queryCache.removeQueries({ queryKey: ['/users'], exact: true });
        message.success(t("content.delete.success", {}, "Content delete successfully"), 10);
        let warn = false;
        dispatch(addList({route: '/users', list: users.reduce((acc, child) => {
          if (user['@id'] !== child['@id']) {
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
    if (!user.edited) {
      dispatch(addList({route: '/users', list: users.map(child => {
        if (user['@id'] !== child['@id']) return child;
        return {...user, edited: true}
      }) ?? []}));
      setUser({...user, ...changedValues, edited: true});
    }
  };

  const hiddenFields = fullSchema ? [...Object.keys(fullSchema.properties), '@type', '@id'] : [];

  return (
    <Form
      {...formProps}
      key={`user_${index}`}
      onValuesChange={(changedValues, allValues) => onChange({ changedValues, allValues })}
      onFinish={(formData) => onFinish({ formData })}
      layout="vertical"
      style={{width: '49%', margin: '0.5%'}}>
      {user &&
        <Card title={
          <Flex align="center" gap={10}>
            <Avatar size={28} { ...(user.isVerified ? {className: 'active'} : {}) }><FiUser /></Avatar>
            { user.email }
          </Flex>
        } extra={ <Flex align="center" gap={10}>
          <Button htmlType="submit" icon={<SaveOutlined />} key="edit" type={user.edited ? "primary" : "default" } />
          <Button type="primary" onClick={() => showDeleteConfirm(onDelete)} danger icon={<DeleteOutlined />} />
        </Flex> }>
          <Flex align="center" gap={10} wrap>
            { Object.keys(user).map(field => !hiddenFields.includes(field) &&
              <Tag key={field} color="blue">
                { t(`form.user.${field}`, {}, field) } :
                { user[field] }
              </Tag>
            ) }
          </Flex>
          { content }
        </Card>
      }
    </Form>
  );
};
