import { Select } from "antd";
import { useCustom, useTranslate } from "@refinedev/core";
import { XList } from "../../utils/form/openApiTypes";

type Props = {
  xList: XList;
  value?: any;
  onChange?: (value: any) => void;
};

export function XListSelect({ xList, value, onChange }: Props) {
  const t = useTranslate();

  const { query } = useCustom({
    url: xList.route,
    method: "get",
  });

  const items = query.data?.data?.member ?? [];
  const loading = query.isLoading;

  return (
    <Select
      loading={loading}
      value={value}
      onChange={onChange}
      options={items.map((item: any) => ({
        value: item[xList.identifier],
        label: t(item[xList.label], {}, xList.labelDefault ? item[xList.labelDefault] : undefined),
      }))}
    />
  );
}
