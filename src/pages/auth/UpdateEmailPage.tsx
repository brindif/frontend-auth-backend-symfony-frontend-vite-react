import { App, Button, Form, Input, Space, Typography, theme } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { AuthPage } from "@refinedev/antd";
import { useUpdatePassword } from "@refinedev/core";
import { UpdateWithTokenRequest } from "../../api/auth/updateWithTokenApi";

export function UpdateEmailPage() {

  const t = useTranslate();
  const [getParams] = useSearchParams();
  const { message } = App.useApp();
  const { mutate: updateWithToken } = useUpdatePassword();
  const [form] = Form.useForm<UpdateWithTokenRequest>();

  const {
    token: { colorBgElevated, colorBorderBg, borderRadiusLG, colorPrimaryTextHover },
  } = theme.useToken();

  const styles: Record<string, React.CSSProperties> = {
    content: {
      padding: '32px',
      maxWidth: '400px',
      margin: "auto",
      backgroundColor: colorBgElevated,
      borderColor: colorBorderBg,
      borderRadius: borderRadiusLG,
    },
    title: {
      textAlign: 'center',
    }
  };

  const onFinish = (values: UpdateWithTokenRequest) => {
    updateWithToken({
      token: getParams.get("token") ?? "",
      email: values['email'] ?? ""
    }, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('update.email.success'), 10);
        } else {
          message.error(t(data?.error?.message ?? "update.email.error.request"), 10);
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
        email: "",
      }}
      onFinish={(values) => onFinish(values)}
    >
      <Typography.Title level={3}>{ t('update.email.title', {}, 'Update email') }</Typography.Title>
      <Form.Item
        label={t("update.email.label", {}, "Email")}
        name="email"
        rules={[{type: "email", message: t(
          "update.email.error.type",
          {},
          "Invalid format."
        )}]}
      >
        <Input />
      </Form.Item>

      <Space>
        <Button type="primary" htmlType="submit">
          {t(`update.email.button`, {}, "Update")}
        </Button>
      </Space>
    </Form>
  );
  return <AuthPage
    type="forgotPassword"
    title={false}
    formProps={{onFinish: onFinish}} />;
}
