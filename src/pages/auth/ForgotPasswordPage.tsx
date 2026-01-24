import { AuthPage } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { useForgotPassword } from "@refinedev/core";
import { App } from "antd";
import { UpdateRequestRequest, TYPE_PASSWORD } from "../../api/auth/updateRequestApi";

export function ForgotPasswordPage() {

  const t = useTranslate();
  const { mutate: updateRequest } = useForgotPassword();
  const { message } = App.useApp();

  const onFinish = (values: UpdateRequestRequest) => {
    updateRequest({
      type: TYPE_PASSWORD,
      email: values.email,
    }, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('update.request.success'), 10);
        } else {
          message.error(t(data?.error?.message ?? "update.request.error.request"), 10);
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
