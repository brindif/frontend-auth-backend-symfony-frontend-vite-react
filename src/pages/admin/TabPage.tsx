import { useState, useEffect } from 'react';
import { Form } from '@rjsf/antd';
import { JSONSchema7 } from 'json-schema';
import validator from '@rjsf/validator-ajv8';
import { useTranslate, useCustomMutation } from "@refinedev/core";
import { selectSchema } from '../../store/admin/selectors';
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { App } from "antd";

export function TabPage () {
  const [schema, setSchema] = useState<JSONSchema7>({});
  const [uiSchema, setUiSchema] = useState({});
  const t = useTranslate();
  const { message } = App.useApp();
  
  const { mutate: postQuery } = useCustomMutation();
  const fullSchema = useAppSelector((state: RootState) => selectSchema(state, '/api/tab'));

  useEffect(() => {
    if (!fullSchema) return;
    setSchema(fullSchema);
    setUiSchema({
      "ui:options": {
        title: t("admin.tab.title", {}, "Create Tab"),
      },
    });
  }, [fullSchema]);

  const onSubmit = ({ formData }: any) => {
    postQuery({
      url: '/tab',
      method: "post",
      values: formData
    }, {
      onSuccess:(data) => {
        message.success(t("admin.tab.success", {}, "Tab created successfully"), 10);
      },
      onError: (error) => {
        message.error(t(error?.message ?? "admin.tab.error.request", {}, "Error creating tab"), 10);
      } 
    });
  };

  return (
    <Form
      className="content"
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
      showErrorList={false}
      liveValidate={false}
    />
  );
};
