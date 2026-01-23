import { AuthPage } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { useForgotPassword } from "@refinedev/core";
import { App } from "antd";
import { ForgotPasswordRequest } from "../../api/auth/forgotPasswordApi";

export function ForgotPasswordPage() {

  const t = useTranslate();
  const { mutate: forgotPassword } = useForgotPassword();
  const { message } = App.useApp();

  const onFinish = (values: ForgotPasswordRequest) => {
    forgotPassword(values, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('forgot.password.success'), 10);
        } else {
          message.error(t(data?.error?.message ?? "forgot.password.error.request"), 10);
        }
      },
    });
  };

  return <AuthPage
    type="forgotPassword"
    title={false}
    formProps={{onFinish: onFinish}}
  />;
}
