import { Typography, theme } from "antd";
import { Button, Form, Input, Space, Tag } from "antd";
import { useTranslate, useCustomMutation } from "@refinedev/core";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/selectors";
import { App } from "antd";
import { setCurentUser } from "../../store/auth/slice";
import { store } from "../../store/store";
import { useForgotPassword } from "@refinedev/core";
import { TYPE_PASSWORD, TYPE_EMAIL } from "../../api/auth/updateRequestApi";

export type UpdateUserFormValues = {
  name: string;
};

export function ProfilePage() {
  const MIN_NAME = 2;
  const MAX_NAME = 100;

  const [form] = Form.useForm<UpdateUserFormValues>();

  const { message } = App.useApp();
  const t = useTranslate();
  const user = useAppSelector(selectCurrentUser);
  const { mutate: updateRequestProvider } = useForgotPassword();
  
  const { mutate } = useCustomMutation();

  const onFinish = (values: any) => {
    mutate({
      url: "/me",
      method: "patch",
      values,
    }, {
      onSuccess: (data) => {
        if (data.data?.success) {
          message.success(t('profile.success'), 10);
          store.dispatch(setCurentUser({
            name: values.name,
            email: user?.email ?? null,
            roles: user?.roles ?? []
          }));
        } else {
          message.error(t(data.data?.message ?? "profile.error.request"), 10);
        }
      },
    });
  };
  
  return (
    <Form
      className='content'
      form={form}
      layout="vertical"
      initialValues={{
        name: user?.name ?? "",
      }}
      onFinish={(values) => onFinish(values)}
    >
      <Typography.Title level={3}>{ t('profile.title', {}, 'User Profile') }</Typography.Title>
      <Form.Item
        label={t("profile.name", {}, "Name")}
        name="name"
        rules={[{type: "string", min: MIN_NAME, max: MAX_NAME, message: t(
          "profile.name.error.limit",
          {min: MIN_NAME, max: MAX_NAME},
          "Name lenght should be between {{min}} and {{max}} char."
        )}]}
      >
        <Input autoComplete="name" />
      </Form.Item>

      <Form.Item label={t("profile.email", {}, "Email")}>
        <Button onClick={() => updateRequestProvider({
            email: user?.email,
            type: TYPE_EMAIL,
          }, {
          onSuccess: (data) => {
            if (data.success) {
              message.success(t('update.request.success'), 10);
            } else {
              message.error(t(data?.error?.message ?? "update.request.error.request"), 10);
            }
          }
        })}>
          {t("profile.email.button", {email: user?.email}, "Change email : {{email}}")}
        </Button>
      </Form.Item>


      <Form.Item label={t("profile.password", {}, "Password")}>
        <Button onClick={() => updateRequestProvider({
            email: user?.email,
            type: TYPE_PASSWORD,
          }, {
          onSuccess: (data) => {
            if (data.success) {
              message.success(t('update.request.success'), 10);
            } else {
              message.error(t(data?.error?.message ?? "update.request.error.request"), 10);
            }
          }
        })}>
          {t("profile.password.button", {}, "Change password")}
        </Button>
      </Form.Item>

      <Form.Item label={t("profile.roles", {}, "Roles")}>
        <Space wrap>
        { Array.isArray(user?.roles) && user.roles.map((role: any) => (
          <Tag key={role} color="blue">
            {t(`profile.roles.${role}`, {}, role)}
          </Tag>
        ))}
        </Space>
      </Form.Item>

      <Space>
        <Button type="primary" htmlType="submit">
          {t(`profile.update`, {}, "Update")}
        </Button>
      </Space>
    </Form>
  );
}
