import { AuthPage } from "@refinedev/antd";
import { App } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { useUpdatePassword } from "@refinedev/core";
import { UpdateWithTokenRequest } from "../../api/auth/updateWithTokenApi";

export function UpdatePasswordPage() {

  const t = useTranslate();
  const { message } = App.useApp();
  const [getParams] = useSearchParams();
  const { mutate: updateWithToken } = useUpdatePassword();


  const onFinish = (values: UpdateWithTokenRequest) => {
    updateWithToken({
      token: getParams.get("token") ?? "",
      password: values['password'] ?? ""
    }, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('update.password.success'), 10);
        } else {
          message.error(t(data?.error?.message ?? "update.password.error.request"), 10);
        }
      },
    });
  };

  return <AuthPage
    type="updatePassword"
    title={false}
    formProps={{onFinish: onFinish}}
  />;
}
