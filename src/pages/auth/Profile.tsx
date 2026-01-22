import { Typography, theme } from "antd";
import { Button, Form, Input, Space, Tag } from "antd";
import { useTranslate, useCustomMutation, useApiUrl } from "@refinedev/core";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/selectors";
import { App } from "antd";
import { setCurentUser } from "../../store/auth/slice";
import { store } from "../../store/store";

export type UpdateUserFormValues = {
  name: string;
};

export function ProfilePage() {
  const MIN_NAME = 2;
  const MAX_NAME = 100;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const styles: Record<string, React.CSSProperties> = {
    content: {
      padding: 24,
      margin: 0,
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
      minHeight: '100dvh',
    },
  };

  const [form] = Form.useForm<UpdateUserFormValues>();

  const { message } = App.useApp();
  const t = useTranslate();
  const user = useAppSelector(selectCurrentUser);
  
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
      style={ styles.content }
      form={form}
      layout="vertical"
      initialValues={{
        name: user?.name ?? "",
      }}
      onFinish={(values) => onFinish(values)}
    >
      <Typography.Title level={4}>{ t('profile.title', {}, 'User Profile') }</Typography.Title>
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
        <Button>{t("profile.email.button", {email: user?.email}, "Change email : {{email}}")}</Button>
      </Form.Item>


      <Form.Item label={t("profile.password", {}, "Password")}>
        <Button>{t("profile.password.button", {}, "Change password")}</Button>
      </Form.Item>

      <Form.Item label={t("profile.roles", {}, "Roles")}>
        <Space wrap>
        { Array.isArray(user?.roles) && user.roles.map(role => (
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
