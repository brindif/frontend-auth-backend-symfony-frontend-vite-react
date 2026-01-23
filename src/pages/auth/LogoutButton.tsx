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
    onClick={() => logout()}
    icon={<FiLogOut />}
  />;
}