import { Typography } from "antd";
import { FaDice } from "react-icons/fa";
import { useTranslate } from "@refinedev/core";
import { Link } from "react-router-dom";
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

  return (
    <Typography.Title level={level} style={ styles.title }>
      <FaDice style={ styles.icon } />
      {t("app.title", {}, "Title")}
      <Link style={ styles.link } to={`/form/tab`}>
        <Button size="small" shape="circle" icon={<PlusOutlined />} />
      </Link>
    </Typography.Title>
  );
}
