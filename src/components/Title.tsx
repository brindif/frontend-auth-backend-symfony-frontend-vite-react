import { Typography } from "antd";
import { FaDice } from "react-icons/fa";
import { useTranslate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

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

  return (
    <Typography.Title level={level} style={ styles.title }>
      <FaDice style={ styles.icon } />
      {t("app.title", {}, "Title")}
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/form/tab`);
        }}
        style={ styles.link }
        size="small"
        shape="circle"
        icon={<PlusOutlined />} />
    </Typography.Title>
  );
}
