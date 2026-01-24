import { App } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { useUpdatePassword, useLogout } from "@refinedev/core";
import { ProfilePage } from "./ProfilePage";
import { useEffect, useRef } from "react";

export function ValidateUpdateEmailPage() {

  const t = useTranslate();
  const [getParams] = useSearchParams();
  const { message } = App.useApp();
  const { mutate: updateWithToken } = useUpdatePassword();
  const { mutate: logout } = useLogout();

  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    updateWithToken({
      token: getParams.get("token") ?? "",
    }, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(t('validate.update.email.success'), 10);
        } else {
          message.error(t(data?.error?.message ?? "validate.update.email.error.request"), 10);
        }
      },
    });
  });

  return <ProfilePage />
}
