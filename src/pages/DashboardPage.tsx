import { Typography, Layout } from "antd";
import { useTranslate } from "@refinedev/core";

export function DashboardPage() {
  const t = useTranslate();

  return (
    <Layout id="content">
      <Typography.Title level={1}>
        { t('app.title', {}, 'Welcome') }
      </Typography.Title>
    </Layout>
  );
}
