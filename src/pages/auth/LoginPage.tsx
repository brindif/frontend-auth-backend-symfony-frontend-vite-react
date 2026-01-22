import { AuthPage } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { useLogin } from "@refinedev/core";
import { App } from "antd";
import { LoginRequest } from "../../api/auth/loginApi";

export function LoginPage() {

  const t = useTranslate();
  const { mutate: login } = useLogin();
  const { message } = App.useApp();

  const onFinish = (values: LoginRequest) => {
    login(values, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('login.success'), 10);
        } else {
          message.error(t(data.message?.error ?? "login.error.request"), 10);
        }
      },
    });
  };

  return <AuthPage
    type="login"
    title={false}
    formProps={{onFinish: onFinish}}
  />;
}
