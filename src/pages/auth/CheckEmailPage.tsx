import { LoginPage } from "./LoginPage";
import { useEffect, useRef } from "react";
import { App } from "antd";
import { useTranslate, useCustom } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/selectors";

export function CheckEmailPage() {

  const t = useTranslate();
  const [getParams] = useSearchParams();
  const calledRef = useRef(false);
  const { message } = App.useApp();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    
    const { result } = useCustom({
      url: "/check-email",
      method: "get",
    });
    if(result?.data) {
      if (result?.data.data?.success) {
        message.success(t('check.email.success'), 10);
      } else {
        message.error(t(result?.data.data?.message ?? "check.email.error.request"), 10);
      }
    };
  }, [message]);

  return <LoginPage />;
}
