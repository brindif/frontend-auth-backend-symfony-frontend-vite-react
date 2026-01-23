import { LoginPage } from "./LoginPage";
import { verifyEmailRequest } from "../../api/auth/verifyEmailApi";
import { useEffect, useRef } from "react";
import { App } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSearchParams } from "react-router-dom";

export function VerifyEmailPage() {

  const t = useTranslate();
  const { message } = App.useApp();
  const [getParams] = useSearchParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    
    const run = async () => {
      try {
        const result = await verifyEmailRequest({
          expires: getParams.get("expires") ?? "",
          signature: getParams.get("signature") ?? "",
          token: getParams.get("token") ?? "",
          id: Number(getParams.get("id")),
        });
        if (result.success) {
          message.success(t("verify.email.success"), 10);
        } else {
          message.error(t(result?.message ?? "verify.email.error.request"), 10);
        }
      } catch(e) {
        message.error(t("verify.email.error.request"), 10);
      }
    };

    run();
  }, [message, t, getParams]);

  return <LoginPage />;
}
