import { Select } from "antd";
import { useCustom, useTranslate } from "@refinedev/core";
import { XList } from "../../utils/form/openApiTypes";

export function XListSelect({ xList }: { xList: XList }) {
  const t = useTranslate();

  const { query } = useCustom({
    url: xList.route,
    method: "get",
  });

  const items = query.data?.data?.member ?? [];
  const loading = query.isLoading;

  return <Select loading={loading} options={items.map((item: any) => ({
    value: item[xList.identifier],
    label: t(item[xList.label], {}, xList.labelDefault ? item[xList.labelDefault] : undefined),
  }))} />;
}
