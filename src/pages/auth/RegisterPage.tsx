import { AuthPage } from "@refinedev/antd";
import { useRegister } from "@refinedev/core";
import { App } from "antd";
import { useTranslate } from "@refinedev/core";

export function RegisterPage() {

  const t = useTranslate();
  const { mutate: register } = useRegister();
  const { message } = App.useApp();

  const onFinish = (values: { email: string; password: string }) => {
    register(values, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('register.verify.email'), 10);
        } else {
          message.error(t(data.message?.error ?? "register.error.request"), 10);
        }
      },
    });
  };

  return <AuthPage
    type="register"
    title={false}
    formProps={{onFinish: onFinish}}
  />;
}
