import { AuthPage } from "@refinedev/antd";
import { checkEmailRequest } from "../../api/auth/checkEmailApi";
import { useEffect, useRef } from "react";
import { App } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { useUpdatePassword } from "@refinedev/core";
import { UpdatePasswordRequest } from "../../api/auth/updatePasswordApi";

export function UpdatePasswordPage() {

  const t = useTranslate();
  const { message } = App.useApp();
  const [getParams] = useSearchParams();
  const calledRef = useRef(false);
  const { mutate: updatePassword } = useUpdatePassword();

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!getParams.get("token")) return;
    
    const run = async () => {
      try {
        const result = await checkEmailRequest({
          token: getParams.get("token") ?? "",
        });
        if (result.success) {
          message.success(t("check.email.success"), 10);
        } else {
          message.error(t(result?.message ?? "check.email.error.request"), 10);
        }
      } catch(e) {
        message.error(t("check.email.error.request"), 10);
      }
    };

    run();
  }, [message, t, getParams]);


  const onFinish = (values: UpdatePasswordRequest) => {
    updatePassword({
      token: getParams.get("token") ?? "",
      password: values['password']
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
