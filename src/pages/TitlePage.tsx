import { Typography } from "antd";
import { FaDice } from "react-icons/fa";
import { useTranslate } from "@refinedev/core";

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
};

export function TitlePage({level = 1}) {
  const t = useTranslate();

  return (
    <Typography.Title level={level} style={ styles.title }>
      <FaDice style={ styles.icon } />
      {t("app.title", {}, "Title")}
    </Typography.Title>
  );
}
