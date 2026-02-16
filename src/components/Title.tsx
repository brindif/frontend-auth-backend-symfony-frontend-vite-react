import { Typography } from "antd";
import { FaDice } from "react-icons/fa";
import { useTranslate } from "@refinedev/core";
import { useNavigate } from "../components/routing/RouteChangeConfirm";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAppSelector } from "../store/hooks";
import { selectCurrentTabs } from "../store/tab/selectors";
import { selectCurrentUser } from "../store/auth/selectors";

const styles: Record<string, React.CSSProperties> = {
  title: {
    minWidth: "200px",
    display: "inline-block",
    margin: 0,
    padding: 0,
    textAlign: "center",
    verticalAlign: "middle",
  },
  icon: {
    verticalAlign: "middle",
    marginRight: "5%",
  },
  link: {
    marginLeft: "5%",
  },
};

export function Title({level = 1}: {level?: 1 | 2 | 3 | 4 | undefined}) {
  const t = useTranslate();
  const navigate = useNavigate();
  const selectedTabs = useAppSelector(selectCurrentTabs);
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Typography.Title level={level} style={ styles.title }>
      <FaDice style={ styles.icon } />
      {t("app.title", {}, "Title")}
      { currentUser &&
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/form/tab`);
          }}
          style={ styles.link }
          size="small"
          shape="circle"
          icon={<PlusOutlined />}
          type={selectedTabs.at(-1) === `/form/tab` ? "primary" : "default"} />
      } 
    </Typography.Title>
  );
}
