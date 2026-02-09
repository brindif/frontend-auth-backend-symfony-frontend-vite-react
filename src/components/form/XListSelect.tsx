import { Select, Space } from "antd";
import { useCustom, useTranslate } from "@refinedev/core";
import { XList } from "../../utils/form/openApiTypes";
import { useAppSelector } from "../../store/hooks";
import { selectList } from "../../store/form/selectors";
import { addList } from "../../store/form/slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  xList: XList;
  value?: any;
  onChange?: (value: any) => void;
};

export function XListSelect({ xList, value, onChange }: Props) {
  const t = useTranslate();
  const dispatch = useDispatch();

  let items = useAppSelector((store) => selectList(store, xList.route));

  const [lastRefetchList, setLastRefetchList] = useState<number>(-1);
  const { query } = useCustom({
    url: xList.route,
    method: "get",
    queryOptions: {
      enabled: lastRefetchList > -1,
      refetchOnMount: false,
    }
  });
  useEffect(() => {
    if (items) return;
    setLastRefetchList(query.dataUpdatedAt);
  }, [items]);
  useEffect(() => {
    if (lastRefetchList === -1 || lastRefetchList === query.dataUpdatedAt) return;
    dispatch(addList({route: xList.route, list: query.data?.data?.member ?? []}));
    setLastRefetchList(-1);
  }, [query, lastRefetchList]);

  return (
    <Select
      loading={!items}
      value={value}
      onChange={onChange}
      options={items ? items.map((item: any) => ({
        value: item[xList.identifier],
        label: <Space>
          { Array.from({length: item.level}).map(() => ("\u00A0\u00A0\u00A0")) }
          { item.level>0 && "\u21B3" }
          { t(item[xList.label], {}, xList.labelDefault ? item[xList.labelDefault] : undefined) }
        </Space>,
      })) : []}
    />
  );
}
