import { Typography, theme } from "antd";

export function DashboardPage({level=1}) {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const styles: Record<string, React.CSSProperties> = {
    content: {
      padding: 24,
      margin: 0,
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
      minHeight: '100dvh',
    },
  };

  return (
    <Typography style={ styles.content }>
      <Typography.Title level={1}>
        Présentation
      </Typography.Title>
    </Typography>
  );
}
