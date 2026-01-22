import { useLogout } from "@refinedev/core";
import { Button } from "antd";
import { FiLogOut } from "react-icons/fi";
import { useTranslate } from "@refinedev/core";
import { App } from "antd";

export function LogoutButton({style={}}) {
  const { mutate: logout } = useLogout();

  const t = useTranslate();
  const { message } = App.useApp();

  return <Button
    style={style}
    onClick={() => logout(undefined, {
      onSuccess: (data) => {
        console.log('onSuccess', data);
        if (data.success) {
          message.success(t("logout.success"));
        } else {
          message.error(t("logout.error.request"));
        }
      },
    })}
    icon={<FiLogOut />}
  />;
}